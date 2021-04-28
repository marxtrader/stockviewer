let fs = require('fs')
let getDates = require('./functions/getDates')

let dates = getDates(process.argv[2])
let command =''
dates.forEach((date)=>{
	command += `node --no-warnings productionApps/nightlyByDate.mjs ${date}\n`
})
fs.writeFileSync("getNightly.sh", "#!\n", (err, data)=>{
	if (err) {
		console.log("error")
	} 	
}) 
fs.appendFile("getNightly.sh", command, (err, data)=>{
	if (err) console.log("error")
})
