
const Results = require('../models/results')
const fs = require('fs')
let axios = require('axios')

// get results from marketdata.results for a specific date



async function getResults(date) {
	let response = axios({
		method:"get",
		url:`http://localhost:3100/results?${date}`,
		config:{ headers: {'Content-Type': 'application/json' }}
	})
	return response
}
// write data to files for importing *.stk into schwab
// get names of experiments
let response = axios({
	method:'get',
	url:`http://localhost:3100/results/names`
})

.then(names=>{

})
// loop through names and write the watchlists
let results = await getResults(date)
results
.then(response => {
	response.data.forEach(record => {
		fileName=record.name

	})
})