const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Tick = new Schema({
		I: {
			type: String
		},
		x: {
			type: Number
		},
		p: {
			type: Number
		},
		i: {
			type: String
		},
		e: {
			type: Number
		},
		r: {
			type: Number
		},
		t: {
			type: Number
		},
		y: {
			type: Number
		},
		f: {
			type: Number
		},
		q: {
			type: Number
		},
		c: {
			type: Array
		},
		s: {
			type: Number
		},
		z: {
			type: Number
		}
	})
	module.exports = mongoose.model('Tick',Tick);
