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

async function main(date) {
	await Eod.find({d:date})
	.then (async(universe) => {
		for (let ticker of universe) {
			console.log("ticker : ", ticker.T)
			let tickerData = await Eod.find({"T":ticker.T, $and:[{d:{$lt:date}}]})
			console.log()
			tickerData.forEach(async (data) => {
				update = {"liquidity":data.v/data.n}
				try {
					let record = await Eod.updateOne({ "T": ticker.T, "d":data.d }, update, {upsert:true});
				} catch (err) {
					console.log(err)
				}
			})
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
