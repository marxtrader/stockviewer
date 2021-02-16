const mongoose = require('mongoose')
const Schema = mongoose.Schema

const datapoints = new Schema({
	averages: {
		type: Array
	}
})

module.exports = mongoose.model('datapoints',datapoints)