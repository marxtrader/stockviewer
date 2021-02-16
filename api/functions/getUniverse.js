import axios from 'axios'
async function getUniverse() {
	let response = axios({
		method:"get",
		url:"http://localhost:3100/experiment/exper1?date=2020-12-30&close=10&volume=1000000",
		config:{ headers: {'Content-Type': 'application/json' }}
	})
	return response
}
export default getUniverse;