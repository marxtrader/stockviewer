// discover number of up days (closing price > pervious day "open"ing price)

const Ticker = require('../models/tickers')
const Eod = require('../models/eods')
const Experiment = require('../models/experiments')
const series = require('../pten/pten.json')
const getUniverse = require('../functions/getUniverse')
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

// Main Code
	for (let i=series.length-2; i>=3; i--) {
		
		// 3 days up
		if ((series[i].c > series[i-1].vw) && 
				(series[i-1].c > series[i-2].vw) && 
				(series[i-2].c > series[i-3].vw)) {
			// meets condition of the filter
			let result = {
				"name":'3daysup',
				"symbol":series[i].T,
				"date":series[i].d
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
				"date":series[i].d 
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

	// getdata({"name":"3daysup", "name":"3daysdown"})
	// .then(function(data) {

	// })
// price appreciation from a given strategy. 
// number of days where the closing price is greater than the previous days o. 
// X = number of successive days to test for
// y = number of days to look back  c[i] > open[y]
// z = number of days to check profitability from point of market entry
// symbols = universe of symbols to examine. (volume, price limits)
// Updays = require('../models/Updays')

// 	symbols.forEach(symbol => {
// 		// get data set dataset=Ticker.DAILY
// 		for (let i=1; i<=x; i++) {
// 			result=updays(days, dataset)
// 			if (result) {
// 				let entryPrice = symbol.DAILY[i+1].avp // use the value weighted avg price.to check price appreciation
// 				results = returnFormula(days, entryPrice, y)
// 				// write results to db
// 				Updays.push(results)
// 			}
// 		}
// 	})
// 