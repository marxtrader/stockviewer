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
import { MultiProgressBars } from 'multi-progress-bars'

import * as util from 'util'
import { DateTime, Settings } from 'luxon'

import * as threads from 'worker_threads'
import Filters from './filters.js'
import {WorkerPool,WorkerBee} from './WorkerPool.js'

import('intl')
// const timezone = import('dayjs/plugin/timezone')
Settings.defaultZoneName = "America/New_York"

// const log_file = fs.createWriteStream('.' + '/debug.log', { flags: 'w' });
// const log_stdout = process.stdout;

const progressBars = new MultiProgressBars({ anchor: "bottom", border: true, persist: false });
export const AddTask = progressBars.addTask.bind(progressBars)
export const IncrementTask = progressBars.incrementTask.bind(progressBars)
export const Done = progressBars.done.bind(progressBars)
// console.log = function (...args) { //
// 	log_file.write(util.format(...args) + '\n');
// 	log_stdout.write(util.format(...args) + '\n');
// };

const config = dotenv.config().parsed
const ESTOffset = -5

// polygon key
let key = config.API_KEY
// console.log(config)
// Filter function should take in an index into the list and return true or false
// Also days is the number of days considered in the calculation
// const Filters = [
// 	{ name: "ALL PASS", days: 1, filter: ()=>true },
// 	{ name: "ALL PASS2", days: 1, filter: ()=>true },
// 	nDaysUp(3),
// 	nDaysDown(3),
// 	{ name: "Gap Up", days: 2, filter: gapUp },
// 	{ name: "Gap Down", days: 2, filter: gapDown },
// ]


const workerPool = new WorkerPool('./productionApps/processTicks.mjs', 128)

// function toDateString(millis) {
// 	return new Date(millis).getTimezoneOffset()("EST")
// }

async function storeDataFor(date) {
	const dateAsString = dateString(date)
	let result;
	// get the eod from polygon

	let Eod = await PolygonUtils.getGroupedDaily({ date: dateAsString })
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
	const promises = []
	const start = Date.now()
	const count = Eod.results.length
	let numProcessed = 0
	for (const eod of Eod.results) {
		// This is where the optimization needs to happen
		// const tickWorker = new threads.Worker('./processTicks.js',{env:threads.SHARE_ENV, workerData:{
		// 	T:eod.T,
		// 	date:dateAsString
		// }})
		promises.push(new Promise((res, rej) =>
			workerPool.run({ ticker: eod.T, date: dateAsString }, (tickInfo) => {
				// Essentially: const tickInfo = await getTicks(eod.T, dateAsString)
				const data = { ...eod, ...tickInfo }
				EODdata.push(data)
				// Databasing.storeEODs([data]).then(_ => {
					numProcessed++
					const elapsed = Date.now()-start
					const s = Math.round((elapsed*count/numProcessed-elapsed)/1000)
					const m = Math.round(s/60) 
					progressBars.incrementTask(DateTask, { message:`~ ${m} min (${s} s)`,percentage: DateIncrement })
					res()
				// })
			}, (e) => {
				console.log(e)
				rej()
			})))
	}
	return Promise.all(promises).then(async res=>{
		progressBars.done(DateTask)
		await Databasing.storeEODs(EODdata)
	}).catch(console.log)
}
async function processRange(start, end) {
	let universe = await Databasing.getDistinct(eods, {}, ['T'])
	const tickers = (universe.T || [])
	let otherLengths
	// loop through active symbols pass to child process for processing
	// console.log("Processing Data:")
	let tickersProcessed = 0
	let progress = 0
	const startTime = Date.now()
	const FilterTask ="Filters"
	progressBars.addTask(FilterTask, { type: "percentage" })
	for (const ticker of tickers) {
		// progressBar("Tickers Processed",tickersProcessed++,tickers.length)
		// get past data data points, should already be sorted
		const dailiesForTicker = await Databasing.getDailies(ticker, start, end)

		if (dailiesForTicker !== null) {
			// if(otherLengths!=dailiesForTicker.length){
			// 	console.log(`while before we had ${otherLengths}, ${ticker} has ${dailiesForTicker.length}`)
			// 	otherLengths=dailiesForTicker.length
			// } 

			// Removes any filters there's not enough data for
			// console.log(Filters)
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

			tickersProcessed++
			progress+=1/tickers.length
			const elapsed = Date.now()-startTime
			const s = Math.round((elapsed*tickers.length/tickersProcessed-elapsed)/1000)
			const m = Math.round(s/60) 
			progressBars.incrementTask(FilterTask, {message:`~ ${m} min (${s} s)`, percentage: progress })

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
	const increment = 1 / daysToProcess
	const StoringTask = "Storing Days"

	progressBars.addTask(StoringTask, { type: "percentage" })
	// const storingData = []
	const start = Date.now()
	for (let i = 0; i < daysToProcess; dateObject = dateObject.minus({ day: 1 })) {
		if (dateObject.weekday < 6) {
			let date = dateString(dateObject)//convertMillisecondsToDate(Date.now()-86400000)
			const storing = storeDataFor(dateObject)
			// storingData.push(storing)

			i++
			const elapsed = Date.now()-start
			const s = Math.round((elapsed*daysToProcess/i-elapsed)/1000)
			const m = Math.round(s/60) 
			storing.then(x=>progressBars.incrementTask(StoringTask, {message:`~ ${m} min (${s} s)`, percentage: increment }))	
			await storing		

		}
	}
	// await Promise.all(storingData)
	progressBars.done(StoringTask)
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