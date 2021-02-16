const Ticker = require('../models/tickers')
const Eod = require('../models/eod')
const axios = require('axios')

async function putdata(data) {
	let response = axios({
		method:"post",
		url:`http://localhost:3100/experiment`,
		data: data,
		config: { headers: {'Content-Type': 'application/json' }}
		})
	return response
}

async function getDataAsync(query) {
  return Ticker.find(query)
}
let query = {"T":"IBM"}
// getDataAsync(query).then(function (data){
//   console.log(data)
// })
let result = {
	"name":'Experiment5',
	"symbol":"TTT",
	"date":"2020-09-12",
}
putdata(result)
.then(function(newRec){
	if (newRec !== null) {
		console.log(newRec.data)
	} else {
		console.log("duplicate")
	}
})
.catch(function(err){
	console.log(err)
})