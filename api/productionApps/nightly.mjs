import * as axios from 'axios'
import * as fs from "fs"
import * as ss from 'simple-statistics'
// let getDates = require('../functions/getDates')
import eods from '../models/eods.js'
import * as Databasing from '../stock-viewer files/Databasing.mjs'
import * as PolygonUtils from '../stock-viewer files/PolygonUtils.mjs'
import dotenv from 'dotenv'

const config = dotenv.config().parsed
const ESTOffset = -5
// polygon key
let key = config.API_KEY
// console.log(config)
// Filter function should take in an index into the list and return true or false
// Also days is the number of days considered in the calculation
const Filters = [
	nDaysUp(3),
	nDaysDown(3),
	{ name: "Gap Up", days: 2, filter: gapUp },
	{ name: "Gap Down", days: 2, filter: gapDown },
]
function setFilter(doc, filter) {
	doc.update({ $addToSet: filter.name })
	console.log("Woohooooooo",filter,doc)
}
function nDaysUp(n) {
	return {
		name: `${n} Days Up`,
		days: n + 1,
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
		days: n + 1,
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

function toDateString(millis){
	return new Date(millis).getTimezoneOffset() ("EST")
}


async function process(date) {
	let result;
	// get the eod from polygon
	let Eod = await PolygonUtils.getGroupedDaily({ date })
	if (Eod !== null) {
		console.log("got Polygon Eod")
	} else {
		console.log("ploygon fetch failed")
		return null
	}

	// write the data to mongo
	// Old code:
	// processEodData(Eod, date)
	
	Databasing.storeEODs(Eod.results)
		.then((resp) => {
			if (resp !== null) {
				console.log("wrote data")
			} else {
				console.log("write failed")//, err.config.data)
			}
		})
		.catch((err) => {
			console.log("DB err: ",err)
		})

	// get tickers to loop through
	// let universe = await getUniverse(date)
	const [y, m, d] = date.split('-').map(Number)
	const startOfDay = Date.UTC(y, m - 1, d);
	const endOfDay = Date.UTC(y, m - 1, d, 23, 59, 59, 999);
	let universe = await Databasing.getDistinct(eods, { t: { $gte: startOfDay, $lte: endOfDay } }, ['T'])
	// loop through active symbols pass to child process for processing
	let dailiesForTicker
	for (let ticker of universe.T) {
		dailiesForTicker = await Databasing.getDailies(ticker,startOfDay,endOfDay) // get past data data points, should already be sorted
		if (dailiesForTicker !== null) {
			// console.log(`got data for ${ticker}`)
			// dailiesForTicker.data.sort((a, b) => { return (a.t - b.t) }) // sort by milliseconds
			// run filters

			for (const filter of Filters) {
				if(dailiesForTicker.length<filter.days)continue
				for (let i = filter.days; i < dailiesForTicker.length; i++) {
					const dailyDoc = dailiesForTicker[i]
					if (filter.filter(dailiesForTicker, i)) {
						setFilter(dailyDoc, filter)
					}
					dailyDoc.save()
				}
				// console.log(dailyDoc.filtersPassed)
			}
			// result = await exp3daysupdown(dailiesForTicker.data)
			// 	.then(console.log("complete 3daysupdown"))

			// result = await exp2daysupdown(dailiesForTicker.data)
			// 	.then(console.log("complete 2daysupdown"))

			// result = await gapupdown(dailiesForTicker.data)
			// 	.then(console.log("complete gapupdown"))

			// //update averages and other data points
			// result = await computeDatapoints(dailiesForTicker.data, ticker, date)
			// 	.then(console.log("complete computeDatapoints"))

		} else {
			console.log("ticker fetch failed")
		}

		// create results lists filtered for certain data.
		// let lists = createResultsLists()

	}
	return true
}
let date = "2021-01-29" //convertMillisecondsToDate(Date.now()-86400000)
process(date).then(async res => {
	console.log("Done")

}).catch((err) => console.log("err",err))







// function threeDaysUp(data, i) {
// 	return (
// 		(data[i].c > data[i - 1].o) &&
// 		(data[i - 1].c > data[i - 2].o) &&
// 		(data[i - 2].c > data[i - 3].o)
// 	)
// }
// function threeDaysDown(data, i) {
// 	return (
// 		(series[i].c < series[i - 1].o) &&
// 		(series[i - 1].c < series[i - 2].o) &&
// 		(series[i - 2].c < series[i - 3].o)
// 	)
// }

let convertMillisecondsToDate = function (date) {
	date = new Date(date)
	let year = date.getFullYear().toString()
	let month = (date.getMonth() + 1).toString()
	let day = date.getDate().toString()
	if ((date.getDay() == 0) || (date.getDay() == 6)) {
		return null
	}
	if (day.length == 1) {
		day = '0' + day
	}
	if (month.length == 1) {
		month = '0' + month
	}
	date = `${year}-${month}-${day}`
	return date
}

let getDates = function (days) {
	let d = new Date()
	let dates = []
	for (let i = 1; i < days; i++) {
		date = d - (i * 86400000)
		dates.push(milliToDate(date))
	}
	return dates
}

const putResults = function (data) {
	axios({
		method: "post",
		url: "http://localhost:4000/results",
		data: data,
		config: { headers: { 'Content-Type': 'application/json' } }
	})
}

async function getTicker(ticker) {
	//console.log("request: ", request)
	let response = axios({
		method: "get",
		url: `http://localhost:4000/eod/ticker?ticker=${ticker}`,
		config: { headers: { 'Content-Type': 'application/json' } }
	})
	return response
}

async function getUniverse(date) {

	let response = await axios({
		method: "get",
		url: `http://localhost:4000/eod/all?date=${date}`,
		config: { headers: { 'Content-Type': 'application/json' } }
	})
	console.log("Count :", response.data.length)
	return response
}

async function processEodData(data, date) {
	data.forEach(async (record) => {
		record.d = date
		record.r = record.h - record.l
		let success = await putEod(record)
	})
	return true
}

async function putEod(record) {
	try {
		let response = axios({
			method: 'post',
			url: `http://localhost:4000/eod`,
			config: { headers: { 'Content-Type': 'application/json' } },
			data: record
		})
		return response
	} catch {
		return null
	}
}

async function putDatapoint(data) {
	let response = axios({
		method: "post",
		url: `http://localhost:4000/averages`,
		data: data,
		config: { headers: { 'Content-Type': 'application/json' } }
	})
		.catch((err) => {
			console.log(err)
		})
	return response
}

async function computeDatapoints(data, ticker, date) {
	//console.log(data)
	//console.log("**************************************")
	if (data.length < 90) {
		return null
	}
	let range = data.map(({ h, l }) => (h - l));
	let weighted = data.map(({ vw }) => (vw))
	let volume = data.map(({ v }) => (v))
	let record = {
		"ticker": ticker,
		"date": date,
		"range": {
			"day90": ss.mean(range.slice(0, 89)),
			"day60": ss.mean(range.slice(0, 59)),
			"day30": ss.mean(range.slice(0, 29)),
			"day15": ss.mean(range.slice(0, 14)),
			"day05": ss.mean(range.slice(0, 4))
		},
		"weighted": {
			"day90": ss.mean(weighted.slice(0, 89)),
			"day60": ss.mean(weighted.slice(0, 59)),
			"day30": ss.mean(weighted.slice(0, 29)),
			"day15": ss.mean(weighted.slice(0, 14)),
			"day05": ss.mean(weighted.slice(0, 4))
		},
		"volume": {
			"day90": ss.mean(volume.slice(0, 89)),
			"day60": ss.mean(volume.slice(0, 59)),
			"day30": ss.mean(volume.slice(0, 29)),
			"day15": ss.mean(volume.slice(0, 14)),
			"day05": ss.mean(volume.slice(0, 4))
		},
		"mktcap": {
			"day90": ss.mean(value.slice(0, 89)),
			"day60": ss.mean(value.slice(0, 59)),
			"day30": ss.mean(value.slice(0, 29)),
			"day15": ss.mean(value.slice(0, 14)),
			"day05": ss.mean(value.slice(0, 4))
		}
	}

	putDatapoint(record)
		.then(res => {
			return res
		})
}

async function getPolygonEod(date) {
	let url = `http://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${date}?apiKey=${key}`
	try {
		let response = await axios({
			method: 'get',
			url: url,
			config: { headers: { 'Content-Type': 'application/json' } }
		})
		return response.data.results
	} catch (e) {
		console.log(e);
	}
}

async function exp3daysupdown(series) {
	let days = 4
	if (series.length < days) {
		return null
	}
	for (let i = series.length - 1; i >= series.length - 1; i--) {
		// 3 days up
		if ((series[i].c > series[i - 1].o) &&
			(series[i - 1].c > series[i - 2].o) &&
			(series[i - 2].c > series[i - 3].o)) {
			// meets condition of the filter
			let result = {
				"name": '3daysup',
				"ticker": series[i].T,
				"date": series[i].d,
				"close": series[i].c,
				"volume": series[i].v
			}
			putResults(result)
			return true
		}

		// 3 days down

		if ((series[i].c < series[i - 1].o) &&
			(series[i - 1].c < series[i - 2].o) &&
			(series[i - 2].c < series[i - 3].o)) {
			// meets condition of the filter
			let result = {
				"name": '3daysdown',
				"ticker": series[i].T,
				"date": series[i].d,
				"close": series[i].c,
				"volume": series[i].v
			}
			putResults(result)
			return true
		}
	}
	return null
}

async function gapupdown(series) {
	let days = 2
	if (series.length < days) {
		console.log("new ticker", series.T)
	} else {
		for (let i = series.length - 1; i >= series.length - 1; i--) {
			if ((series[i].l > series[i - 1].h)) {
				let result = {
					"name": 'gapup',
					"ticker": series[i].T,
					"date": series[i].d,
					"close": series[i].c,
					"volume": series[i].v
				}
				putResults(result)
				return true
			}

			if (series[i].h < (series[i - 1].l)) {
				// meets condition of the filter
				let result = {
					"name": 'gapdown',
					"ticker": series[i].T,
					"date": series[i].d,
					"close": series[i].c,
					"volume": series[i].v
				}
				putResults(result)
				return true
			}
		}
	}
	return null
}

async function exp2daysupdown(series) {
	let days = 3
	if (series.length < days) {
		console.log("no Joy")
	} else {
		for (let i = series.length - 1; i >= series.length - 1; i--) {
			// 3 days up
			if ((series[i].c > series[i - 1].h) &&
				(series[i - 1].c > series[i - 2].o)) {
				// meets condition of the filter
				let result = {
					"name": '2daysup',
					"ticker": series[i].T,
					"date": series[i].d,
					"close": series[i].c,
					"volume": series[i].v
				}
				putResults(result)
				return true
			}

			// 3 days down

			if ((series[i].c < series[i - 1].l) &&
				(series[i - 1].c < series[i - 2].o)) {
				// meets condition of the filter
				let result = {
					"name": '2daysdown',
					"ticker": series[i].T,
					"date": series[i].d,
					"close": series[i].c,
					"volume": series[i].v
				}
				putResults(result)
				return true
			}
		}
	}
	return null
}

// let vals = [
// 	{isValue:true,dayIndex:1,propertyName:'c'},
// 	{isValue:false,operator:'*'},
// 	{isValue:true,dayIndex:-1,propertyName:'vw'},
// ]
/**
 * (series.data[i].c < series.data[i-1].o) &&
					(series.data[i-1].c < series.data[i-2].o) &&
					(series.data[i-2].c < series.data[i-3].o)
 */
/**
 * const _3daysDown = [
 * {day:0,prop:'c'},
 * {op:'<'},
 * {day:-1,prop:'o'},
 *
 * {op:'&'},
 *
 * {day:-1,prop:'c'},
 * {op:'<'},
 * {day:-2,prop:'o'},
 *
 * {op:'&'},
 *
 * {day:-2,prop:'c'},
 * {op:'<'},
 * {day:-3,prop:'o'},
 * ]
 *
 * const _3daysDownFunc = tokensToFunction(_3daysDown, series.data)
 * _3daysDownFunc(i)
 */
// let a ={
// 	isValue:Boolean,
// 	value:{dayIndex:number,propertyName:property}|('*'|'/'|'+'|'-'),
// 	args: [] // For Operation
// 	} 