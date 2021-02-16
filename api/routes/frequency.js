// a list of the experiments to run against the data set
const express = require('express')
const router = express.Router()
const Frequency = require('../models/frequency')

router.get('/', async (req, res) =>{
	console.log("get Results")
	query = req.query.ticker
	let ws = await frequency.find({"ticker":req.query.ticker})
	.then(ws => {
		res.json(ws)
	})
	.catch(err => {
		res.json(err)
	})
})

router.post('/', async (req, res) => {
	const update = { "ticker":req.body.ticker, "price":req.body.price, $inc: { "volume": req.body.volume } };
	const result = await Frequency.updateOne({ ticker: req.body.ticker, price:req.body.price }, update, {upsert:true});
  if (result != null) {
    res.json(result) 
  } else {
    res.status(400)
  }
})

module.exports = router