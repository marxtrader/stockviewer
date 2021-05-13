require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.connect(`${process.env.DATABASE_URL}`, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log(`Connected to Database at ${process.env.DATABASE_URL}`))

// mongoose.connect(`${process.env.DATABASE_URL2}`, { useUnifiedTopology: true, useNewUrlParser: true })
// const db1 = mongoose.connection
// db1.on('error', (error) => console.error(error))
// db1.once('open', () => console.log(`Connected to Database at ${process.env.DATABASE_URL2}`))

// var ModelA    = conn.model('Model', new mongoose.Schema({
//   title : { type : String, default : 'model in testA database' }
// }));

// // stored in 'testB' database
// var ModelB    = conn2.model('Model', new mongoose.Schema({
//   title : { type : String, default : 'model in testB database' }
// }));

app.use(cors())
app.use(express.json())

// const subscribers = require('./routes/symbols')
// app.use('/symbols', subscribers)

const eod = require('./routes/eod')
app.use('/eod', eod)

// const experiment = require('./routes/experiment')
// app.use('/experiment', experiment)

// const results = require('./routes/results')
// app.use('/results', results)

// const tickers = require('./routes/tickers')
// app.use('/tickers', tickers)

// const options = require('./routes/options')
// app.use('/options', options)

// const frequency = require('./routes/frequency')
// app.use('/frequency', frequency)

// const averages = require('./routes/averages')
// app.use('/averages', averages)

app.use("*",(q,s)=>{
	console.log(q,s)
})
const server =app.listen(3100, () => {
	console.log('Server Started')
})