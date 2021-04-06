import * as axios from 'axios'
import * as fs from "fs"
import mongoose from 'mongoose'
import * as ss from 'simple-statistics'
// let getDates = require('../functions/getDates')
import eods from '../models/eods.js'
import { getTicks } from '../functions/getTicks.mjs'
import * as Databasing from '../old stock-viewer files/Databasing.mjs'
import * as PolygonUtils from '../old stock-viewer files/PolygonUtils.mjs'
import dotenv from 'dotenv'
import pkg from 'multi-progress-bars';
const { MultiProgressBars } = pkg;

import * as util from 'util'
import luxpkg from 'luxon';
const { DateTime, Settings } = luxpkg;

import('intl')
// const timezone = import('dayjs/plugin/timezone')
Settings.defaultZoneName = "America/New_York"


const progressBars = new MultiProgressBars({ anchor: "bottom", border: true, persist:false});
export const AddTask = progressBars.addTask.bind(progressBars)
export const IncrementTask = progressBars.incrementTask.bind(progressBars)
export const Done = progressBars.done.bind(progressBars)


const config = dotenv.config().parsed
const ESTOffset = -5
// polygon key
let key = config.API_KEY

const Filters = [
	{ name: "ALL PASS", min: 0, max: 0, filter: () => true },
	{ name: "ALL PASS2", min: 0, max: 0, filter: () => true },
	nDaysUp(3),
	nDaysDown(3),
	{ name: "Gap Up", min: -1, max: 0, filter: gapUp },
	{ name: "Gap Down", min: -1, max: 0, filter: gapDown },
]
Filters.forEach(calcDays)
function calcDays(filter) {
	filter.minIndex = Math.min(filter.min, 0)
	filter.maxIndex = Math.max(filter.max, 0)
	filter.days = filter.maxIndex - filter.minIndex + 1
	return filter.days
}
async function setFilter(doc, filter) {
	await doc.updateOne({ $addToSet: { filtersPassed: filter.name } })
}
function nDaysUp(n) {
	return {
		name: `${n} Days Up`,
		// days: n + 1,
		min: - n, max: 0,
		filter: (data, i) => {
			const start = i - n;
			for (let day = start; day < i; day++) {
				if (data[day + 1].c <= data[day].o)
					return false;
			}
			return true;
		}
	}
}
function nDaysDown(n) {
	return {
		name: `${n} Days Down`,
		// days: n + 1,
		min: - n, max: 0,
		filter: (data, i) => {
			const start = i - n;
			for (let day = start; day < i; day++) {
				if (data[day + 1].c >= data[day].o)
					return false;
			}
			return true;
		}
	}
}
function gapUp(series, i) {
	return series[i].l > series[i - 1].h
}
function gapDown(series, i) {
	return series[i].h < (series[i - 1].l)
}

async function storeDataFor(date) {
	const dateAsString = dateString(date)
	let result;
	// get the eod from polygon
	
	let Eod = await PolygonUtils.getGroupedDaily({ date:dateAsString })
	if (Eod == null) {
		console.log("ploygon fetch failed")
		return null
	}
	if (Eod.results.length == 0) {
		console.log("No data")
		return null
	}

	// All EOD records, with the added data
	const EODdata = []

	if (Eod.results.length == 0) {
		console.log("No data")
		return null
	}


	const DateTask = `Storing ${dateAsString}`
	const DateIncrement = 1 / Eod.results.length
	progressBars.addTask(DateTask, { type: "percentage" })
	for (const eod of Eod.results) {
		// This is where the optimization needs to happen
		const tickInfo = await getTicks(eod.T, dateAsString)
		EODdata.push({ ...eod, ...tickInfo })
		progressBars.incrementTask(DateTask, { percentage: DateIncrement })
	}
	progressBars.done(DateTask)

	// const EODdata = Eod.results
	await Databasing.storeEODs(EODdata)

}
async function processRange(start, end) {
	let universe = await Databasing.getDistinct(eods, {}, ['T'])
	const tickers = (universe.T || [])
	let otherLengths
	// loop through active symbols pass to child process for processing
	// console.log("Processing Data:")
	let tickersProcessed = 0
	for (const ticker of tickers) {
		// progressBar("Tickers Processed",tickersProcessed++,tickers.length)
		// get past data data points, should already be sorted
		const dailiesForTicker = await Databasing.getDailies(ticker, start, end)

		if (dailiesForTicker !== null) {

			// Removes any filters there's not enough data for
			const FiltersToCheck = Filters.filter(f => f.days <= dailiesForTicker.length)

			//Iterates over every filter
			for (const filter of FiltersToCheck) {
				const daysToProcess = dailiesForTicker.length - filter.maxIndex
				for (let i = -filter.minIndex; i < daysToProcess; i++) {
					const dialy = dailiesForTicker[i]
					if (filter.filter(dailiesForTicker, i)) {
						await setFilter(dialy, filter)
					}
				}
			}
			for (const daily of dailiesForTicker) {
				await daily.save()
			}
			// //update averages and other data points
			// result = await computeDatapoints(dailiesForTicker.data, ticker, date)
			// 	.then(console.log("complete computeDatapoints"))

		} else {
			console.log("ticker fetch failed")
		}

	}
	// progressBar("Tickers Processed", tickers.length, tickers.length)
	return true

}
function dateString(date) {
	return date.toFormat('yyyy-MM-dd')
}

const FullProgressBar = 20
async function processPast(daysToProcess) {
	console.log(`Processing the past ${daysToProcess} days`)
	let now = DateTime.now()
	let marketIsStillOpen = now.hour < 16

	let dateObject = DateTime.local(now.year, now.month, now.day)
	if (marketIsStillOpen) {
		dateObject = dateObject.minus({ day: 1 })
	}
	const startOfRange = dateObject.toMillis();
	const StoringTask = "Storing Days"
	const increment = 1 / daysToProcess
	progressBars.addTask(StoringTask, { type: "percentage" })
	for (let i = 0; i < daysToProcess; dateObject = dateObject.minus({ day: 1 })) {
		if (dateObject.weekday < 6) {
			let date = dateString(dateObject)//convertMillisecondsToDate(Date.now()-86400000)
			await storeDataFor(dateObject)
			progressBars.incrementTask(StoringTask, { percentage: increment })
			i++
		}
	}
	progressBars.incrementTask(StoringTask)

	const endOfRange = dateObject.toMillis();

	await processRange(startOfRange, endOfRange)
}

const numberOfDays = +(process.argv[2] || 10)
const programStart = new Date()
processPast(numberOfDays).then(() => {
	const time = new Date() - programStart
	console.log(`Processed ${numberOfDays} day(s) in ${time}ms`)
	mongoose.disconnect()
	console.log("Done Disconnecting")
})


// {filtersPassed:{$ne:[],$exists:true}}
// {filtersPassed:{$not:{$ne:[],$exists:true}}}