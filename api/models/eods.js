const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eod = new Schema({
	T:{
		type:String,
		required:true
	},
	t: {
		type:Number,
		required:true
	},
	o:{
		type:Number,
		required:true
	},
	h:{
		type:Number,
		required:true
	},
	l:{
		type:Number,
		required:true
	},
	c:{
		type:Number,
		required:true
	},
	v:{
		type:Number,
		required:true
	},
	vw:{
		type:Number
	},
	n:{
		type:Number
	},
	d:{
		type:String,
		required:true
	}	
})

module.exports = mongoose.model('eod',eod)