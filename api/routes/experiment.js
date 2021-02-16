// a list of the experiments to run against the data set
const express = require('express')
const router = express.Router()
const Experiments = require('../models/experiments')
const Eod = require('../models/eods')
const Result= require('../models/results')


// Creating one
router.post('/', async (req, res) => {
  console.log("Req Body: ", req.body)
  const experiment = new Experiments(req.body)  // { Name: , Results:{} }
  //console.log("Experiment:", experiment)
  const newExperiment = await experiment.save()
  if (newExperiment != null) {
    console.log("return record :", newExperiment.ticker)
    res.end("ok") 
  } else {
    res.sendStatus(404)
  }
})

router.get('/lte20gte10', async (req, res)=>{
  let results=[]
  experiment = await Eod.find({ 
    $and: [ 
      {c:{ $lte: 20 }}, 
      {c: { $gte: 10.01 } },
      {d: "2020-12-31"},
      {v: { $gte:2000000 } } 
    ] 
  })
      //console.log("rest :", results)
  res.json(experiment)
})

// Getting working set. returns array of tickers
router.get('/exper1', async (req, res)=>{
  let results=[]
  experiment = await Eod.find( { 
    		$and: [ 
    			{c: { $lte: req.query.close } }, 
    			{d: req.query.date}, 
    			{v: { $gte:req.query.volume } }
    		]
      }).sort({t : 1}) 
      experiment.forEach(record =>{
        results.push(record.T)
      })
      //console.log("rest :", results)
  res.json(results)
})

// get all the symbols
router.get('/tickers', async (req, res) =>{
	let ws = await Eod.distinct("T", {"d":"2020-12-30"})
	.then(ws => {
		res.json(ws)
	})
	.catch(err => {
		res.json(err)
	})
})

// Getting One
router.get('/:name', getExperiment, (req, res) => {
  res.json(res.experiment)
})

async function getExperiment(req, res, next) {
  let experiment
  try {
    experiment = await Experiment.find({name:req.params.name})
    if (experiment == null) {
      return res.status(404).json({ message: 'Cannot find experiment' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.experiment = experiment
  next()
}
module.exports = router