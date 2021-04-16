let fs = require('fs')
let getDates = require('./functions/getDates')

const path = "getNightly.bat"

try {
  fs.unlinkSync(path)
  //file removed
} catch(err) {
  console.error(err)
}

let dates = getDates(process.argv[2])
let command =''
dates.forEach((date)=>{
	command += `node --no-warnings productionApps/nightlyByDate.mjs ${date}\n`
	console.log(command)
})
fs.writeFileSync("getNightly.bat", command, (err, data)=>{
	if (err) console.log("error")
})
