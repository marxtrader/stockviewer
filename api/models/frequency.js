const mongoose = require('mongoose')
const Schema = mongoose.Schema

const frequency = new Schema({
	ticker : {
		type: String,
		required:true
	},
	price : {
		type: Number,
		required:true
	},
	volume: {
		type: Number,
		required: true
	}
})

module.exports = mongoose.model('frequency',frequency)