const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Daily = new Schema({
	t:{
		type:Schema.Types.Number,
		required:true
	},
	o:{
		type:Schema.Types.Number,
		required:true
	},
	h:{
		type:Schema.Types.Number,
		required:true
	},
	l:{
		type:Schema.Types.Number,
		required:true
	},
	c:{
		type:Schema.Types.Number,
		required:true
	},
	v:{
		type:Schema.Types.Number,
		required:true
	},
	vw:{
		type:Schema.Types.Number,
		required:true
	},
	liquidity:{
		type:Schema.Types.Number,
		required:true
	},
});

export default mongoose.model('Daily',Daily);