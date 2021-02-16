let axios = require('axios')

async function getUniverse(query) {
	// fetch(`http://localhost:3100/eod/experiment`)
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log("response: ", data)
  //     this.setState({
  //       transactions:data
  //     })
  //   })
  //   .catch(err => {
  //     console.log(err)
  //     this.setState(this.initialState)
	// 	});
		
	let response = await axios.get({
		url:`http://localhost:3100/eod/lte10`,
		data:query
	})
	if (response == null) {
		return res.status(404).json({ message: 'Cannot find eod' })
	}
	return response
}

async function getData(symbol) {
	runExperiment(symbolData)
}

async function runExperiment({ex}) {
	let result = writeExperimentReultsToFile(results)
}

async function writeExperimentResultsToFile() {
	let response
}

//getUniverse({"c": {$lte:10}, "d":"2020-07-17", "n": {$gte:5000}})