// discover number of up days (closing price > pervious day "open"ing price)
//const Eod = require('../models/eod')
const Ticker = require('../models/tickers')
const series = require('../pten/pten.json')
console.log(series[series.length-1].c)
console.log(series.length)
// for each element in the universe check against the algo

	let results={}
	for (let i=series.length-1; i>=3; i--) {
		if ((series[i].c > series[i-1].vw) && 
				(series[i-1].c > series[i-2].vw) && 
				(series[i-2].c > series[i-3].vw)) {
			// meets condition of the filter
			let result = {
				"result":'passed',
				"ticker":series[i].T,
				"date":series[i].d,
				"close":series[i].c,
				"prev":series[i-1].vw,
				"openPrice":series[i+1].o
			}
			//console.log("passed :", series[i].c, series[i-1].vw, series[i+1].vw, series[i].d)
			console.log(result)
		} 
	} 

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