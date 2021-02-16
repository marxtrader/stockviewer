// discover number of up days (closing price > pervious day "open"ing price)

const Ticker = require('../models/tickers')
const Eod = require('../models/Eod')
const Experiment = require('../models/experiments')
const series = require('../pten/pten.json')
const getUniverse = require('../functions/getUniverse')
let axios = require('axios')

series.sort(function(a, b){
	// list isn't always sorted by date. sort by milliseconds. 
	return a.t-b.t
})

const roi = function(a,b) {
	// returns percentage
	return (1-(a/b)).toFixed(2)
}

const profit = function(a,b) {
	return (a-b).toFixed
}

const range = function(a,b) {
	return (a-b).toFixed
}

async function putdata(data) {
	let response = axios({
		method:"post",
		url:`http://localhost:3100/experiment`,
		data: data,
		config: { headers: {'Content-Type': 'application/json' }}
		})
	return response
}

async function calcProfit(result) {}

async function getUniverse() {
	let response = axios({
		method:"get",
		url:"http://localhost:3100/experiment/exper1?date=2020-11-02&close=05&volume=2000000",
		config:{ headers: {'Content-Type': 'application/json' }},
		data:query
	})
	return response
}

async function getdata(query) {
	let response = axios({
		method:"get",
		url:"http://localhost:3100/experiment/exper1?date=2020-12-29&close=05&volume=2000000",
		config:{ headers: {'Content-Type': 'application/json' }},
		data:query
	})
	return response
}

// Main Code
getUniverse().then( function(ticker) {
	getdata(ticker).then(function(series){
		for (let i=series.length-21; i>=3; i--) {
		
			// 3 days up
			if ((series[i].c > series[i-1].vw) && 
					(series[i-1].c > series[i-2].vw) && 
					(series[i-2].c > series[i-3].vw)) {
				// meets condition of the filter
				let result = {
					"name":'3daysup',
					"symbol":series[i].T,
					"date":series[i].d,
					"openPrice":series[i+1].o,
					"returns":[
						{
							"one":{
								profit:(series[i+1].o - series[i+1].c).toFixed(2),				
								range:(series[i+1].h-series[i+1].l),
								percent:((series[i+1].o - series[i+1].c)/series[i+1].o)
							},
							"two":(series[i+1].o - series[i+2].c).toFixed(2),			
							"three":(series[i+1].o - series[i+3].c).toFixed(2),					
							"four":(series[i+1].o - series[i+4].c).toFixed(2),				
							"five":(series[i+1].o - series[i+5].c).toFixed(2),					
							"ten":(series[i+1].o - series[i+10].c).toFixed(2),				
							"twenty":(series[i+1].o - series[i+20].c).toFixed(2)
						}
					]
				}
	
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
			if ((series[i].c < series[i-1].vw) && 
					(series[i-1].c < series[i-2].vw) && 
					(series[i-2].c < series[i-3].vw)) {
				// meets condition of the filter
				let result = {
					"name":'3daydown',
					"symbol":series[i].T,
					"date":series[i].d,
					"openPrice":series[i+1].o,
					"returns":[
						{
							"one":(series[i+1].o - series[i+1].c).toFixed(2),				
							"two":(series[i+1].o - series[i+2].c).toFixed(2),			
							"three":(series[i+1].o - series[i+3].c).toFixed(2),					
							"four":(series[i+1].o - series[i+4].c).toFixed(2),				
							"five":(series[i+1].o - series[i+5].c).toFixed(2),					
							"ten":(series[i+1].o - series[i+10].c).toFixed(2),				
							"twenty":(series[i+1].o - series[i+20].c).toFixed(2)
						}
					]
				}
	
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
	// for (let i=series.length-21; i>=3; i--) {
		
	// 	// 3 days up
	// 	if ((series[i].c > series[i-1].vw) && 
	// 			(series[i-1].c > series[i-2].vw) && 
	// 			(series[i-2].c > series[i-3].vw)) {
	// 		// meets condition of the filter
	// 		let result = {
	// 			"name":'3daysup',
	// 			"symbol":series[i].T,
	// 			"date":series[i].d,
	// 			"openPrice":series[i+1].o,
	// 			"returns":[
	// 				{
	// 					"one":{
	// 						profit:(series[i+1].o - series[i+1].c).toFixed(2),				
	// 						range:(series[i+1].h-series[i+1].l),
	// 						percent:((series[i+1].o - series[i+1].c)/series[i+1].o)
	// 					},
	// 					"two":(series[i+1].o - series[i+2].c).toFixed(2),			
	// 					"three":(series[i+1].o - series[i+3].c).toFixed(2),					
	// 					"four":(series[i+1].o - series[i+4].c).toFixed(2),				
	// 					"five":(series[i+1].o - series[i+5].c).toFixed(2),					
	// 					"ten":(series[i+1].o - series[i+10].c).toFixed(2),				
	// 					"twenty":(series[i+1].o - series[i+20].c).toFixed(2)
	// 				}
	// 			]
	// 		}

	// 		putdata(result)
	// 		.then(function(newRec){
	// 			if (newRec !== null) {
	// 				console.log(newRec.data)
	// 			} else {
	// 				console.log("duplicate")
	// 			}
	// 		})
	// 		.catch(function(err){
	// 			console.log(err)
	// 		})
	// 	} 

	// 	// 3 days down
	// 	if ((series[i].c < series[i-1].vw) && 
	// 			(series[i-1].c < series[i-2].vw) && 
	// 			(series[i-2].c < series[i-3].vw)) {
	// 		// meets condition of the filter
	// 		let result = {
	// 			"name":'3daydown',
	// 			"symbol":series[i].T,
	// 			"date":series[i].d,
	// 			"openPrice":series[i+1].o,
	// 			"returns":[
	// 				{
	// 					"one":(series[i+1].o - series[i+1].c).toFixed(2),				
	// 					"two":(series[i+1].o - series[i+2].c).toFixed(2),			
	// 					"three":(series[i+1].o - series[i+3].c).toFixed(2),					
	// 					"four":(series[i+1].o - series[i+4].c).toFixed(2),				
	// 					"five":(series[i+1].o - series[i+5].c).toFixed(2),					
	// 					"ten":(series[i+1].o - series[i+10].c).toFixed(2),				
	// 					"twenty":(series[i+1].o - series[i+20].c).toFixed(2)
	// 				}
	// 			]
	// 		}

	// 		putdata(result)
	// 		.then(function(newRec){
	// 			if (newRec !== null) {
	// 				console.log(newRec.data)
	// 			} else {
	// 				console.log("duplicate")
	// 			}
	// 		})
	// 		.catch(function(err){
	// 			console.log(err)
	// 		})
	// 	}
	// } 
