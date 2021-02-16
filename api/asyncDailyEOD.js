const fs = require("fs")
var axios = require ('axios')
// get number of days of history

let date = process.argv[2]
console.log(date)
fs.readFile(`./data/${date}.json`,'utf8', (err, data) => {
	if (err) { 
		console.log("Read Error")
	} else {
		let file = JSON.parse(data)
		file.forEach(record => {
			record.d=date
			try {
				axios({
				method: 'post',
				url: `http://localhost:3100/eod`,
				config: { headers: {'Content-Type': 'application/json' }},
				data:record
				})
				.then(async (response) => {
					console.log("Processed")
				})
				.catch(async (err) => {
					console.log("Async Catch: ",err.config.data)
					// newRec = JSON.stringify(record) +'\n'
					// fs.appendFile('errorRecords.txt', newRec, (error, data)=>{
					// 	if (error) {
					// 		console.log("fs append error")
					// 	}
					// })
				})
			} catch (e) {
				console.log(e);
			}
		})
	}
})
