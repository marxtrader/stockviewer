const mongoose = require('mongoose')
const Eod = require ('../models/eods')

let ss = require('simple-statistics')

mongoose.connect(`mongodb://localhost/stock-daily`, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log(`Connected to Database at http://localhost/stock-daily`))

async function getdata(date) {
	//console.log("request: ", request)
	let response = await Eod.find({d:date})
	return response
}

async function averages(data) {

	let range = data.map(({ h,l }) => (h-l));
	let weighted = data.map(({ vw }) => (vw))
	let volume = data.map(({ v }) => (v))
	let count = data.map(({count}) => (count))
	let blockCount = data.map(({blockCount}) => (blockCount))
	let oddlotCount = data.map(({oddlotCount}) => (oddlotCount))
	let oddlotVolume = data.map(({oddlotVolume}) => (oddlotVolume))
	let blockVolume = data.map(({blockVolume}) => (blockVolume))
	//console.log(oddlotCount)
	let record = {
	//return {
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

		"oddlotCount_day90": ss.mean(oddlotCount.slice(0,89)),
		"oddlotCount_day60": ss.mean(oddlotCount.slice(0,59)),
		"oddlotCount_day30": ss.mean(oddlotCount.slice(0,29)),
		"oddlotCount_day15": ss.mean(oddlotCount.slice(0,14)),
		"oddlotCount_day05": ss.mean(oddlotCount.slice(0,4)),

		"blockVolume_day90": ss.mean(blockVolume.slice(0,89)),
		"blockVolume_day60": ss.mean(blockVolume.slice(0,59)),
		"blockVolume_day30": ss.mean(blockVolume.slice(0,29)),
		"blockVolume_day15": ss.mean(blockVolume.slice(0,14)),
		"blockVolume_day05": ss.mean(blockVolume.slice(0,4)),

		"oddlotVolume_day90": ss.mean(oddlotVolume.slice(0,89)),
		"oddlotVolume_day60": ss.mean(oddlotVolume.slice(0,59)),
		"oddlotVolume_day30": ss.mean(oddlotVolume.slice(0,29)),
		"oddlotVolume_day15": ss.mean(oddlotVolume.slice(0,14)),
		"oddlotVolume_day05": ss.mean(oddlotVolume.slice(0,4)),

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
	return record
}

async function main(date) {
	// let result;
	// let data;
	await Eod.find({d:date})
	.then (async(universe) => {
		for (let ticker of universe) {
			console.log("ticker : ", ticker.T)
			let tickerData = await Eod.find({"T":ticker.T})
			//console.log(tickerData)
			let update = await averages(tickerData)
			//console.log(update)
			let record = await Eod.updateOne({ "T": ticker.T, "d":date }, update, {upsert:true});
			//console.log("record",record)
		}		
	})
	.catch((err) =>{
		console.log(err)
	})
	return true
}

let date = process.argv[2]

main(date)
	.then(() => {
 		db.close()
		console.log("done")
	})
	.catch((err)=>{
		console.log(err)
	})
