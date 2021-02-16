// a list of the experiments to run against the data set
const express = require('express')
const router = express.Router()
const Results = require('../models/results')

router.get('/namedate', async (req, res) =>{
	let ws = await Results.find({"date":req.query.date, "name":req.query.name})
	res.json(ws)
})

router.get('/dates', async (req, res) =>{
	console.log("get Results")
	req.query = "date"
	let ws = await Results.distinct(req.query)
	.then(ws => {
		res.json(ws)
	})
	.catch(err => {
		res.json(err)
	})
})

router.get('/names', async (req, res) =>{
	console.log("get Results")
	req.query = "name"
	let ws = await Results.distinct(req.query)
	.then(ws => {
		res.json(ws)
	})
	.catch(err => {
		res.json(err)
	})
})

router.post('results/result', async (req, res) => {
  console.log("/result post : ", req.body)
  const result = new Result(req.body)
  const newResult = await result.save()
  if (newResult != null) {
    res.json(newResult) 
  } else {
    res.status(400)
  }
})

router.post('/', async (req, res) => {
  console.log("results/ post ", req.body)
  const result = new Results(req.body)
  const newResult = await result.save()
  if (newResult != null) {
    res.json(newResult) 
  } else {
    res.status(400)
  }
})

async function getResults(req, res, next) {
  let result
  //console.log(req)
  try {
    result = await Results.find({"date":req.query.date})
    if (result == null) {
      console.log("empty")
      return res.status(404).json({ message: 'Cannot find results for that date' })
    }
  } catch (err) {
    console.log("error")
    return res.status(500).json({ message: err.message })
  }
  //console.log(result)
  res.result = result
  next()
}

module.exports = router