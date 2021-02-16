// discover number of up days (closing price > pervious day "open"ing price)

const Ticker = require('../models/tickers')
const Eod = require('../models/eods')
const Experiment = require('../models/experiments')
const Results = require('../models/results')
//const series = require('../pten/pten.json')

let axios = require('axios')

async function putdata(data) {
	let response = axios({
		method:"post",
		url:`http://localhost:3100/results`,
		data: data,
		config: { headers: {'Content-Type': 'application/json' }}
		})
	return response
}

async function getdata(ticker) {
	let request = `http://localhost:3100/eod/${ticker}`
	//console.log("request: ", request)
	let response = axios({
		method:"get",
		url:`http://localhost:3100/eod/${ticker}`,
		config:{ headers: {'Content-Type': 'application/json' }}
	})
	return response
}

async function getUniverse() {
	let response = await axios({
		method:"get",
		url:"http://localhost:3100/experiment/exper1?date=2020-12-31&close=20&volume=2000000",
		config:{ headers: {'Content-Type': 'application/json' }}
	})
	return response
}

async function runExperiment(series) {
	for (let i=series.data.length-1; i>=series.data.length-10; i--) {
		// 3 days up
		if ((series.data[i].c > series.data[i-1].o) && 
				(series.data[i-1].c > series.data[i-2].o) && 
				(series.data[i-2].c > series.data[i-3].o)) {
			// meets condition of the filter
			let result = {
				"name":'3daysup',
				"ticker":series.data[i].T,
				"date":series.data[i].d,
				"close":series.data[i].c
			}
			return result
			//console.log("Result: ", result)
			// putdata(result)
			// .then(function(newRec){
			// 	if (newRec == null) {
			// 		console.log("duplicate")
			// 	}
			// })
			// .catch(function(err){
			// 	console.log(err.config.data)
			// })
		}

		// 3 days down
		if ((series.data[i].c < series.data[i-1].o) && 
				(series.data[i-1].c < series.data[i-2].o) && 
				(series.data[i-2].c < series.data[i-3].o)) {
			// meets condition of the filter
			let result = {
				"name":'3daysdown',
				"ticker":series.data[i].T,
				"date":series.data[i].d,
				"close":series.data[i].c
			}
			return result
			//console.log("Result: ", result)
			// putdata(result)
			// .then(function(newRec){
			// 	if (newRec == null) {
			// 		console.log("duplicate")
			// 	}
			// })
			// .catch(function(err){
			// 	console.log(err.config.data)
			// })					
		}
	}
	return null
}
// Main Code

async function process() {
	let universe = await getUniverse()
	universe.data.forEach( async ticker => {
		let data = await getdata(ticker)
		let result = await runExperiment(data)
		if (result !== null) {
			let putrec = await putdata(result)
		}
	})
	return true
}
process().then(res => console.log(res)).catch((err)=>console.log(err))				