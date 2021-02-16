// discover number of up days (closing price > pervious day "open"ing price)
const Eod = require('../models/eod')
const Ticker = require('../models/tickers')
//import axios from 'axios'

data= [
	{
		"open":2,
		"close":3
	},
	{
		"open":4,
		"close":5
	},
	{
		"open":6,
		"close":7
	},
	{
		"open":8,
		"close":9
	},
	{
		"open":10,
		"close":11
	},
	{
		"open":12,
		"close":10
	}
]

async function getData(query) {
	result = await Eod.find(query)
	return result
}

	// get universe of stocks where price is less than 10.
	async function getUniverse() {
		let query = {"c": {$lte:10}, "d":"2020-07-17", "n": {$gte:5000}}
		let universe=[]
		try {
			universe = await getData(query)
			.then( async () => {
				if (universe == null) {
					console.log("universe fetch failed")
				} else {
					console.log("else :",universe[0])
					return universe
				}
			})
			.catch(console.log("error"))
			
		} catch {
			console.log('something blew up')
		}
	}
	
	// for each element in the universe check against the algo

async function processfile() {
	for (let obj = 0;obj < universe.length;obj++) {
		let series=[]
		console.log(universe[obj].T)
		try {
			series = await getData({"T":universe[obj].T})
			// ordered list by date
			// step backward calculating successive updays
			for (let i=series.length-1; i<days; i--) {
				if ((series[i].close > series[i-1].open) && (series[i-1].close > series[i-2].open) && (series[i-2].close > series[i-3].open)) {
					// meets condition of the filter
					console.log(series[i].T)
				}
			} 
		} catch {
			console.log('fail')
		}
	}
}

getUniverse()





// price appreciation from a given strategy. 
// number of days where the closing price is greater than the previous days open. 
// X = number of successive days to test for
// y = number of days to look back  close[i] > open[y]
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

	// function takes up days, subsequent buy price, days forward-  returns a table with number of updays on y axis , number of days and the returns on the x axis. 