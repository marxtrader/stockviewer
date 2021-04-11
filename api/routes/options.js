// a list of the experiments to run against the data set
const express = require('express')
const router = express.Router()
const Results = require('../models/results')
const Databasing = import('../old stock-viewer files/Databasing.mjs')
// import * as Databasing from '../stock-viewer files/Databasing'

// router.get('/price', async (req, res) =>{
// 	let options=[]
// 	let ws = await Results.find({"close":{$lte:}})
// 	ws.forEach((name) => {
// 		options.push({"label":name, "value":name})
// 	})
// 	res.json(options)
// })
router.get('/tickers', async (req, res) => {
	let options = []
	let ws = await Results.distinct("ticker", { "date": req.query.date })
	ws.forEach((name) => {
		options.push({ "label": name, "value": name })
	})
	res.json(options)
})

router.get('/dates', async (req, res) => {
	let options = []
	let ws = await Results.distinct("date")
	ws.forEach((name) => {
		options.push({ "label": name, "value": name })
	})
	res.json(options)
})

router.get('/names', async (req, res) => {
	let options = []
	let ws = await Results.distinct("name")
	ws.forEach((name) => {
		options.push({ "label": name, "value": name })
	})
	res.json(options)
})

router.get('/tickers', async (req, res) => {
	console.log("query: ", req.query)
	let priceQuery = ''
	switch (req.query.price) {
		case '10':
			priceQuery = `$lte:"${10}"`
			break;
		case "20":
			priceQuery = `"date":"${req.query.date}","name":"${req.query.name}",$and : [ {"close":{$lte:${20}}}, {"close":{$gte:${10.01}}}  ]`
			break;
		case "30":
			priceQuery = `"date":"${req.query.date}","name":"${req.query.name}", $and : [ {"close":{$lte:${30}}}, {"close":{$gte:${20.01}}}  ]`
			break;
		case "40":
			priceQuery = `"date":"${req.query.date}","name":"${req.query.name}", $and : [ {"close":{$lte:${40}}}, {"close":{$gte:${30.01}}}  ]`
			break;
		default:
			priceQuery = 10
	}

	console.log('query: ', priceQuery)
	let options = []
	let ws = await Results.distinct("ticker", { priceQuery })
	if (ws == null) {
		res.end(priceQuery)
	}
	console.log("Ws : ", ws)
	ws.forEach((ticker) => {
		options.push({ "label": ticker, "value": ticker })
	})
	res.json(options)
})

router.get('/price', async (req, res) => {
	let filter = { c: { $lte: req.query.ub }, c: { $gte: req.query.lb } }
	let ws = await Results.distinct("ticker", { filter })
	ws.forEach((name) => {
		options.push({ "label": name, "value": name })
	})
	res.json(options)
})

router.get('/filter', async (req, res) => {
	res.json(
		await Databasing.getDistinct(
			Results,
			req.query.filters?JSON.parse(req.query.filters):{},
			req.query.options? JSON.parse(req.query.options):[]
		)
	)
})

module.exports = router
/**
 * db.collection.aggregate([
  {
    "$match": {
      name: "Marcel",
      age: 1
    }
  },
  {
    "$group": {
      _id: null,
      key: {
        $addToSet: "$key"
      },
      age: {
        $addToSet: "$age"
      },
      
    }
  },
  {
    "$project": {
      _id: 0,
      key: "$key",
      age: "$age",
      /**   score: "$_id.score"
      
    }
  }
])
 */