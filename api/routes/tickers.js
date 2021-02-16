const express = require('express')
const router = express.Router()
const Eod = require('../models/eods')
const Ticker = require('../models/tickers')
const Results = require('../models/results')

router.get('/all', async (req, res) =>{
	console.log("get Ticker")
	req.query="SECTOR"
	let ws = await Ticker.distinct(req.query)
	.then(ws => {
		res.json(ws)
	})
	.catch(err => {
		res.json(err)
	})
})

router.get('/avg', async (req, res) => {
  let data=[]
  let query = {"SYMBOL": "IBM"}
  try {
    data = await Ticker.find(query)
    if (data == null) {
      return res.status(404).json({ message: 'Cannot find eod' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.json(data)
});

// // Getting One
// router.get('/:T', getEod, (req, res) => {
//   //console.log(res)
//   res.json(res.eod)
// })

// // Creating one
// router.post('/', async (req, res) => {
//   //console.log("Req Body: ", req.body)
//   const eod = new Eod(req.body)
//   //console.log("Eod:", eod)
//   const newEod = await eod.save()
//   if (newEod != null) {
//     console.log("return record :", newEod.T)
//     res.status(200) 
//   } else {
//     res.status(400)
//   }
// })

// // Updating One
// router.patch('/', async (req, res) => {
// 	result = await Tickers.find({ SYMBOL: req.body }) 
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
// async function patch (data) {
//   let ticker;
//   try {
//     ticker = await Ticker.findOne({"T":data.T})
//     .then(async (ticker) => {
//       if (ticker == null) {
//         return null
//       } else {
//         ticker.AVG(data.averages)
//         const newTicker = await ticker.save()
//         return newTicker
//       }
//     })
//     .catch((err) => {
//       console.log(err.config.data)
//     })
//   } catch (err) {
//     return err
//   }
// }
module.exports = router;