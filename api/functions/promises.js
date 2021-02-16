var Promise = require('promise');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/stocks';
const Ticker = require('../models/tickers')
MongoClient.connect(url)

.then(function(db) {
    db.collection('symbols').insertOne({
        symbol: "A",
        industry: "NewEmployee"
    })

    .then(function(db1) {
        db1.collection('symbols').insertOne({
            symbol: "AAAA",
            industry: "NewEmployee1"
        })
    })
});