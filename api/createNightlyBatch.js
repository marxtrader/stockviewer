let fs = require('fs')
let getDates = require('./functions/getDates')

let dates = getDates(180)
.
	dates.forEach((date)=>{
		let command = `node productionApps/nightlyByDate.mjs ${date}\n`
		console.log(command)
		fs.appendFile("getNightly.bat", command, (err, data)=>{
			if (err) console.log("error")
		})
	})
