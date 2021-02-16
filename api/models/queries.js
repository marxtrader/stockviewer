const mongoose = require('mongoose')
const Schema = mongoose.Schema

const queries = new Schema({
	name: {
		type: String,
		required:true
	},
	query: {
		type: String,
		required: true
	}
	
})

module.exports = mongoose.model('queries',queries)