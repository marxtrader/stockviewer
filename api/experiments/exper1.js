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
		url:`http://localhost:3100/experiment/result`,
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
	let response = axios({
		method:"get",
		url:"http://localhost:3100/experiment/exper1?date=2020-12-29&close=10&volume=2000000",
		config:{ headers: {'Content-Type': 'application/json' }}
	})
	return response
}

// Main Code

let results=[]
getUniverse().then( function(ticker) {
	//console.log("ticker: ",ticker.data)
	ticker.data.forEach(symbol => {
		//console.log(symbol)
		getdata(symbol).then(function(series) {
			//console.log("series: ",series)
			for (let i=series.data.length-1; i>=series.data.length-3; i--) {
				// 3 days up
				if ((series.data[i].c > series.data[i-1].vw) && 
						(series.data[i-1].c > series.data[i-2].vw) && 
						(series.data[i-2].c > series.data[i-3].vw)) {
					// meets condition of the filter
					let result = {
						"name":'3daysup',
						"symbol":series.data[i].T,
						"date":series.data[i].d
					}
					//console.log("Result: ", result)
					putdata(result)
					.then(function(newRec){
						if (newRec !== null) {
							console.log(newRec.data)
						} else {
							console.log("duplicate")
						}
					})
					.catch(function(err){
						console.log(err)
					})
				} 
		
				// 3 days down
				if ((series.data[i].c < series.data[i-1].vw) && 
						(series.data[i-1].c < series.data[i-2].vw) && 
						(series.data[i-2].c < series.data[i-3].vw)) {
					// meets condition of the filter
					let result = {
						"name":'3daysdown',
						"symbol":series.data[i].T,
						"date":series.data[i].d
					}
					//console.log("Result: ", result)
					putdata(result)
					.then(function(newRec){
						if (newRec !== null) {
							console.log(newRec.data)
						} else {
							console.log("duplicate")
						}
					})
					.catch(function(err){
						console.log(err)
					})					
				}
			}
		})
	})
})
				