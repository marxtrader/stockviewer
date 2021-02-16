let fs = require('fs')

fs.readdir('./data/', (err, data)=>{
	data.forEach((file)=>{
		let date = file.slice(0,10)
		let command = `node asyncDailyEOD ${date}\n`
		console.log(command)
		fs.appendFile("history.bat", command, (err, data)=>{
			if (err) console.log("error")
		})
	})
})