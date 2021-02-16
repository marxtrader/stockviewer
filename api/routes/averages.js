const express = require('express')
const router = express.Router()
const Averages = require('../models/averages')


// Creating one
router.post('/', async (req, res) => {
  const averages = new Averages(req.body)
  const newAverages = await averages.save()
  if (newAverages !== null) {
    console.log("return record :", newAverages)
    res.end("ok") 
  } else {
    res.status(400)
  }
})

// Creating one
router.patch('/', async (req, res) => {
  const averages = Averages.find(req.body.ticker)

  const newAverages = await averages.save()
  if (newAverages !== null) {
    console.log("return record :", newAverages)
    res.end("ok") 
  } else {
    res.status(400)
  }
})

// Updating One
// router.patch('/', async (req, res) => {
//   result = await testPatch(req.body)
//   if (result == null) {
//     res.status(400)
//   }
//     res.json(req.body)
// })

// // Deleting One
// router.delete('/:id', getEod, async (req, res) => {
//   try {
//     await res.eod.remove()
//     res.json({ message: 'Deleted Eod' })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// router.get('/all', async (req, res) =>{
//   console.log("req: ", req.query)
// 	let ws = await Eod.distinct("T", {"d":req.query.date})
// 	res.json(ws)
// })

// router.get('/c-lte10v20m', async (req, res) =>{
//   console.log("req: ", req.query)
// 	let ws = await Eod.find({"c": {$lte:req.query.price}, "d":req.query.date, "v":{$gte:req.query.volume}})
// 	res.json(ws)
// })

// // Getting One
// router.get('/ticker', async (req, res) => {
//   console.log(req.query)
//   let result = await Eod.find({"T":req.query.ticker})
//   res.json(result)
// })

// // Getting One
// router.get('/:T', getEod, (req, res) => {
//   //console.log(res)
//   res.json(res.eod)
// })

// async function getEod(req, res, next) {
//   let eod
//   let query={"T":req.params.T}
//   try {
//     eod = await Eod.find(query)
//     if (eod == null) {
//       return res.status(404).json({ message: 'Cannot find eod' })
//     }
//   } catch (err) {
//     return res.status(500).json({ message: err.message })
//   }
//   //console.log(eod)
//   res.eod = eod
//   next()
// }

module.exports = router