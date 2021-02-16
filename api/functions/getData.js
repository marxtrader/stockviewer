const Eod = require('../models/Eod')
async function getData(query) {
	result = await Eod.find(query)
	return result
}
module.exports=getData;