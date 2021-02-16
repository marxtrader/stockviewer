const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Averages = new Schema({
	ticker: {
		type: String,
		required:true
	},
	range: [
		{
			"day90": {
				type: Number
			},
			"day60": {
				type: Number
			},
			"day30": {
				type: Number
			},
			"day15": {
				type: Number
			},
			"day05": {
				type: Number
			}
		}
	],
	weighted: [
		{
			"day90": {
				type: Number
			},
			"day60": {
				type: Number
			},
			"day30": {
				type: Number
			},
			"day15": {
				type: Number
			},
			"day05": {
				type: Number
			}
		}
	],
	volume: [
		{
			"day90": {
				type: Number
			},
			"day60": {
				type: Number
			},
			"day30": {
				type: Number
			},
			"day15": {
				type: Number
			},
			"day05": {
				type: Number
			}
		}
	]
})

module.exports = mongoose.model('Averages',Averages)