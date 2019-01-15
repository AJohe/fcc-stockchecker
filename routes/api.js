/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var request = require('request');
var mongoose = require('mongoose');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  // connect to database
  mongoose.connect(CONNECTION_STRING);

// set up database
  var Schema = mongoose.Schema;

  var stockSchema = new Schema({
    symbol: {type: String, required: true},
    likes: Number,
    ipAddress: []
      });

  var Stock = mongoose.model('Stock', stockSchema);

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stockSymbol;
      let stockSymbol2;
      let likes = 0;
      let likes2 = 0;
    
      if(Array.isArray(req.query.stock)) {
         stockSymbol = req.query.stock[0].toUpperCase();
         stockSymbol2 = req.query.stock[1].toUpperCase();
      }else {
         stockSymbol = req.query.stock.toUpperCase();
         stockSymbol2 = '';
      }

      // look through database for user's ip address
      if(stockSymbol2 == '') {
      Stock.findOne({symbol: stockSymbol}, (err, doc) => {
        if(err) {
          console.log('there was an error');
        }else if(!doc && !req.query.like){
          Stock.create({
            symbol: stockSymbol,
            likes,
          }, (err, document) => {
            console.log('fired');
          });
        }else if(!doc) {
          likes++;
          Stock.create({
            symbol: stockSymbol,
            likes,
            ipAddress: [req.ip]
          }, (error, document) => {
            console.log('fired 2');
          });
        }else if(doc && req.query.like) {
          if(doc.ipAddress.indexOf(req.ip) >= 0) { 
            console.log('already liked');
            likes = doc.likes;
            return;
           }else {
             console.log(doc.ipAddress.indexOf(req.ip));
          doc.likes++,
          doc.ipAddress.push(req.ip)
          doc.save((error, document) => {
            likes = document.likes;
            console.log('fired 3');
          });
        }
        }else {
          console.log('fired 4');
          likes = doc.likes;
        }
      });
    }else {
      Stock.findOne({symbol: stockSymbol}, (err, doc) => {
        if(err) {
          console.log('there was an error');
        }else if(!doc && !req.query.like){
          Stock.create({
            symbol: stockSymbol,
            likes,
          }, (err, document) => {
            console.log('fired 5');
          });
        }else if(!doc) {
          likes++;
          Stock.create({
            symbol: stockSymbol,
            likes,
            ipAddress: [req.ip]
          }, (error, document) => {
            console.log('fired 6');
          });
        }else if(doc && req.query.like) {
          if(doc.ipAddress.indexOf(req.ip) >= 0) { 
            console.log('already liked 2');
            likes = doc.likes;
            return;
           }else {
             console.log(doc.ipAddress.indexOf(req.ip));
          doc.likes++,
          doc.ipAddress.push(req.ip)
          doc.save((error, document) => {
            likes = document.likes;
            console.log('fired 7');
          });
        }
        }else {
          console.log('fired 8');
          likes = doc.likes;
        }
      });

      Stock.findOne({symbol: stockSymbol2}, (err, doc) => {
        if(err) {
          console.log('there was an error');
        }else if(!doc && !req.query.like){
          Stock.create({
            symbol: stockSymbol2,
            likes: likes2,
          }, (err, document) => {
            console.log('fired 9');
          });
        }else if(!doc) {
          likes2++;
          Stock.create({
            symbol: stockSymbol2,
            likes2,
            ipAddress: [req.ip]
          }, (error, document) => {
            console.log('fired 10');
            console.log(likes2);
          });
        }else if(doc && req.query.like) {
          if(doc.ipAddress.indexOf(req.ip) >= 0) { 
            console.log('already liked 3');
            likes2 = doc.likes;
            console.log(likes2);
            return;
           }else {
             console.log(doc.ipAddress.indexOf(req.ip));
          doc.likes++,
          doc.ipAddress.push(req.ip)
          doc.save((error, document) => {
            likes2 = document.likes;
            console.log('fired 11');
            console.log(likes2);
          });
        }
        }else {
          console.log('fired 12');
          likes2 = doc.likes;
          console.log(likes2);
        }
      });
    }

      // testing request
      request('https://api.iextrading.com/1.0/stock/market/batch?symbols=' + stockSymbol + ',' + stockSymbol2 + '&types=price', function (error, response, body) {
        if(error) {
          //console.log('error:', error);
          res.send('Could not find stock');
      }else {
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body);
        const data = JSON.parse(body);
        console.log('one ' + likes);
        console.log('two ' + likes2);
        // response object
        if(stockSymbol2 == '') {
        res.json({
          stockData: {
            stock: stockSymbol,
            price: data[stockSymbol].price,
            likes
          }
        });
      }else {
        res.json({
          stockData: [{
            stock: stockSymbol,
            price: data[stockSymbol].price,
            rel_likes: likes-likes2
          }, {
            stock: stockSymbol2,
            price: data[stockSymbol2].price,
            rel_likes: likes2-likes
          }]
        });
      }
      }

});

    });
    
};
