var config = require('../config/config')
var express = require('express');
var axios = require('axios')
var mysqlQuery = require('../functions/mysqlQuery')
var app = express();


postToDb(data) => {
	let query = `SELECT * FROM tickerdetails WHERE SYMBOL='${req.query.ticker}';`
	mysqlQuery(query, function(err, data) {
		if (!err) {
			console.log("data : ", data)
			res.end(JSON.stringify(data, null, 2))
		} else {
			res.end(err)
		}
	})
}

app.get('/daily', (req, res)=> {
	let query = `https://www.fitchdata.com/api/pricing/historical/day1?symbol=req.query.${symbol}&${startdate}&${enddate}&key=MWKI4TE7P3X2KX1ACP43UHTXZ`

	axios.get(query)
		.then(function (response) {
			console.log("data : ", response)
			res.end(JSON.stringify(response, null, 2))
		})
		.catch(function (error) {
			console.log(error);
		});
})

app.get('/symbols', (req, res)=> {
	let query = `https://www.fitchdata.com/api/search/filter/stocks?status=ACTIVE&key=MWKI4TE7P3X2KX1ACP43UHTXZ`
	axios.get(query)
	.then(function (response) {
		//console.log("data : ", response.content[0])
		//let data = (JSON.parse(response, null, 2))
		//console.log(response.data.count)
    //postToDb(response.data.content)
    response.data.content.forEach(object => {
      console.log(object.symbol)
    })
		res.end('ok')
	})
	.catch(function (error) {
		console.log(error);
	});
})


// app.get('/tickers', (req, res)=> {
// 	let query = `https://www.fitchdata.com/api/search/filter/stocks?status=ACTIVE&key=MWKI4TE7P3X2KX1ACP43UHTXZ`

// })


module.exports = app;