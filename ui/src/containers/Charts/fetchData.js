async function getData(ticker) {
	//let request = `http://localhost:3100/eod/${ticker}`
	//console.log("request: ", request)
	let response = axios({
		method:"get",
		url:`http://localhost:3100/eod/${ticker}`,
		config:{ headers: {'Content-Type': 'application/json' }}
	})
	return response
}

// async function getDataAsync(symbol) {

//   let response = axios({
//     method: 'get',
//     url: `http://localhost:3100/${symbol}`, // gets all the records for a particular stock. 
//     config: { headers: {'Content-Type': 'application/json' }}
//   })
//   return response
// }
export default getData;
// module.exports = getData;
// module.exports = getDataAsync;