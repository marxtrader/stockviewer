let mongoose = require('mongoose')
const Record = require('../models/test')

mongoose.connect(`mongodb://localhost/ubuntu`, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => {
	console.log(`Connected to Database at localhost`)
  const record = new Record({name:"Henry"})
  const newRecord = record.save()
	.then(()=>{db.close()})
})




