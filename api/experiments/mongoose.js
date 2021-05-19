let mongoose = require('mongoose')
//const Record = require('../models/test')
const Frequency=require('../models/frequency')

mongoose.connect(`mongodb://localhost/testFreq`, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => {
	console.log(`Connected to Database at testFreq`)
	const update = { $inc: { "volume": 1000 } };
	Frequency.findOne({"ticker":"ticker"})
	.then((record)=>{
	let prc = 25
	let volume=1000	
	// Frequency.findByIdAndUpdate({ id: "ticker", "frequnecyTable.price": 25 }, update, {upsert:true})
	// .then((record)=>{
		array = (record.frequencyTable)
		for (const [key, value] of Object.entries(array)) {
			//console.log(` for loop: ${key}: ${value}`)
			if (value.price == prc) {
				value.volume += volume
				console.log(`${key}: ${value}`)
			}
		}
		db.close()
	})
	.catch((err)=>{
		console.log(err)
		db.close()
	})
})
	// if (record == null) {
	// 	record.price=25
	// 	record.volume=333
	// } else {
	// 	record.frequencyTable
	// }
	// const wasUpdated = Frequency.updateOne({ ticker: "ticker", frequnecyTable.price: 25 }, update, {upsert:true});
	// console.log(`Was updated: ${wasUpdated}, ${newKey}: ${result}`);
	// .then(()=>{db.close()})





