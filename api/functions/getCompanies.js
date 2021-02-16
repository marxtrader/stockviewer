//https://www.fitchdata.com/api/search/filter/stocks?type=common%20stock&status=ACTIVE&key=MWKI4TE7P3X2KX1ACP43UHTXZ
//https://www.fitchdata.com/api/search/filter/stocks?type=etf&status=ACTIVE&key=MWKI4TE7P3X2KX1ACP43UHTXZ

var axios = require ('axios')
var fs = require('fs')
let common=0
let etf=1
let filedata=''

if (common) {
  try {
	axios({
	method: 'get',
	url: `https://www.fitchdata.com/api/search/filter/stocks?type=common%20stock&status=ACTIVE&key=MWKI4TE7P3X2KX1ACP43UHTXZ`,
	config: { headers: {'Content-Type': 'application/json' }}
	})
	.then(function (response) {
	  //console.log (ticker, response.data.content.all)
	filedata = JSON.stringify(response.data.content)
	fs.writeFile(`./marketdata/companies/common.json`, filedata, function (err) {
	  if (err) throw err;
	  console.log(`Saved common stocks`);
	});
	  //console.log(filedata)
	})
	.catch(function (response) {
	  //handle error
	  console.log(response)
	});

  } catch (e) {
	alert(e);
  }
}

if (etf) {
	try {
		axios({
		method: 'get',
		url: `https://www.fitchdata.com/api/search/filter/stocks?type=etf&status=ACTIVE&key=MWKI4TE7P3X2KX1ACP43UHTXZ`,
		config: { headers: {'Content-Type': 'application/json' }}
		})
		.then(function (response) {
			//console.log (ticker, response.data.content.all)
		filedata = JSON.stringify(response.data.content)
		fs.writeFile(`./marketdata/companies/etf.json`, filedata, function (err) {
			if (err) throw err;
			console.log(`Saved etf`);
		});
			//console.log(filedata)
		})
		.catch(function (response) {
			//handle error
			console.log(response)
		});

	} catch (e) {
		alert(e);
	}
}