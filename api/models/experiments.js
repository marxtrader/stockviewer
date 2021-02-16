const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// put results from our experiments into a collection
let Experiment = new Schema({
	name : {
		type: String,
		required:true
	},	
	date: {
		type:String,
		required:true
	},
	symbol: {
		type: String,
		required: true
	}
});
Experiment.index({ name: 1, date: 1}, { unique: true });
module.exports = mongoose.model('Experiment', Experiment);