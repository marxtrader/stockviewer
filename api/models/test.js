const mongoose = require('mongoose')
const Schema = mongoose.Schema

const test = new Schema({
	name:String
})

module.exports = mongoose.model('test',test)