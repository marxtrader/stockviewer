const express = require('express')
const router = express.Router()
const Eod = require('../models/eods')
const Ticker = require('../models/tickers')

// Creating one
router.post('/', async (req, res) => {
  //console.log("Req Body: ", req.body)
  const eod = new Eod(req.body)
  //console.log("Eod:", eod)
  const newEod = await eod.save()
  if (newEod != null) {
    console.log("return record :", newEod.T)
    res.status(200) 
  } else {
    res.status(400)
  }
})

// Updating One
router.patch('/', async (req, res) => {
  result = await testPatch(req.body)
  if (result == null) {
    res.status(400)
  }
    res.json(req.body)
})

// Deleting One
router.post('/delete', async (req, res) => {
  try {
    await Eod.deleteMany({d:req.query.date})
    res.json({ message: 'Deleted Eod' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/all', async (req, res) =>{
  console.log("req: ", req.query)
	let ws = await Eod.distinct("T", {"d":req.query.date})
	res.json(ws)
})

// Getting One
router.get('/ticker', async (req, res) => {
  console.log(req.query)
  let result = await Eod.find({"T":req.query.ticker})
  res.json(result)
})

// Getting One
router.get('/:T', getEod, (req, res) => {
  //console.log(res)
  res.json(res.eod)
})

async function getEod(req, res, next) {
  let eod
  let query={"T":req.params.T}
  try {
    eod = await Eod.find(query)
    if (eod == null) {
      return res.status(404).json({ message: 'Cannot find eod' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  //console.log(eod)
  res.eod = eod
  next()
}

module.exports = router