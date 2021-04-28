const mongoose = require('mongoose')
let axios = require('axios')
let ss = require('simple-statistics')
//let data = require('../data/mtnb.json')

mongoose.connect(`${process.env.DATABASE_URL}`, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log(`Connected to Database at ${process.env.DATABASE_URL}`))

async function getdata(ticker, date) {
	//console.log("request: ", request)
	let response = axios({
		method:"get",
		url:`http://localhost:4000/eod/ticker?${ticker}`,
		config:{ headers: {'Content-Type': 'application/json' }}
	})
	return response
}

async function getUniverse(date) {
	
	let response = await axios({
		method:"get",
		url:`http://localhost:4000/eod/all?date=${date}}`,
		config:{ headers: {'Content-Type': 'application/json' }}
	})
	console.log("Count :",response.data.length)
	return response
}

async function putAverage(data) {
	let response = axios({
		method:"patch",
		url:`http://localhost:4000/eod/tickdata`,
		data: data,
		config: { headers: {'Content-Type': 'application/json' }}
	})
	.catch((err)=>{
		console.log(err)
	})
	return response
}

async function averages(data, ticker, date) {
	//console.log(data)
	//console.log("**************************************")
	let range = data.map(({ h,l }) => (h-l));
	let weighted = data.map(({ vw }) => (vw))
	let volume = data.map(({ v }) => (v))
	let count = data.map(({count}) => (count))
	let blockCount = data.map(({blockCount}) => (blockCount))
	let oddLotCount = data.map(({oddLotCount}) => (oddLotCount))
	let oddLotVolume = data.map(({oddLotVolume}) => (oddLotVolume))
	let blockVolume = data.map(({blockVolume}) => (blockVolume))
	let record = {
		"query": {
			"T": ticker,
			"d": date
		},
		"data": {
			"count_day90": ss.mean(count.slice(0,89)),
			"count_day60": ss.mean(count.slice(0,59)),
			"count_day30": ss.mean(count.slice(0,29)),
			"count_day15": ss.mean(count.slice(0,14)),
			"count_day05": ss.mean(count.slice(0,4)),

			"blockCount_day90": ss.mean(blockCount.slice(0,89)),
			"blockCount_day60": ss.mean(blockCount.slice(0,59)),
			"blockCount_day30": ss.mean(blockCount.slice(0,29)),
			"blockCount_day15": ss.mean(blockCount.slice(0,14)),
			"blockCount_day05": ss.mean(blockCount.slice(0,4)),

			"oddLotCount_day90": ss.mean(oddLotCount.slice(0,89)),
			"oddLotCount_day60": ss.mean(oddLotCount.slice(0,59)),
			"oddLotCount_day30": ss.mean(oddLotCount.slice(0,29)),
			"oddLotCount_day15": ss.mean(oddLotCount.slice(0,14)),
			"oddLotCount_day05": ss.mean(oddLotCount.slice(0,4)),

			"blockVolume_day90": ss.mean(blockVolume.slice(0,89)),
			"blockVolume_day60": ss.mean(blockVolume.slice(0,59)),
			"blockVolume_day30": ss.mean(blockVolume.slice(0,29)),
			"blockVolume_day15": ss.mean(blockVolume.slice(0,14)),
			"blockVolume_day05": ss.mean(blockVolume.slice(0,4)),

			"oddLotVolume_day90": ss.mean(oddLotVolume.slice(0,89)),
			"oddLotVolume_day60": ss.mean(oddLotVolume.slice(0,59)),
			"oddLotVolume_day30": ss.mean(oddLotVolume.slice(0,29)),
			"oddLotVolume_day15": ss.mean(oddLotVolume.slice(0,14)),
			"oddLotVolume_day05": ss.mean(oddLotVolume.slice(0,4)),

			"range_day90": ss.mean(range.slice(0,89)),
			"range_day60": ss.mean(range.slice(0,59)),
			"range_day30": ss.mean(range.slice(0,29)),
			"range_day15": ss.mean(range.slice(0,14)),
			"range_day05": ss.mean(range.slice(0,4)),

			"weighted_day90": ss.mean(weighted.slice(0,89)),
			"weighted_day60": ss.mean(weighted.slice(0,59)),
			"weighted_day30": ss.mean(weighted.slice(0,29)),
			"weighted_day15": ss.mean(weighted.slice(0,14)),
			"weighted_day05": ss.mean(weighted.slice(0,4)),

			"volume_day90": ss.mean(volume.slice(0,89)),
			"volume_day60": ss.mean(volume.slice(0,59)),
			"volume_day30": ss.mean(volume.slice(0,29)),
			"volume_day15": ss.mean(volume.slice(0,14)),
			"volume_day05": ss.mean(volume.slice(0,4))
		}
	}
	return record
	// putAverage( record ) 
	// .then(res =>{
	// 	return res
	// })
}

async function process(date) {
	// let result;
	// let data;
	let universe = await getUniverse(date)
	universe.data.sort(function(a, b){return a.ticker-b.ticker});
	for (let ticker of universe.data) {
		console.log("ticker : ", ticker)
		tickerData = await getdata(ticker,date)
		//console.log("tickerData : ", tickerData)
		tickerData.data.sort((a,b)=> {return(b.t-a.t)}) // sort by milliseconds
		let avg_ret = averages(tickerData.data, ticker)
	}
	return true
}
process(date).then(res => console.log("Done")).catch((err)=>console.log(err))
