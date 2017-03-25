'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var amazon = require('amazon-product-api');

var client = amazon.createClient({
  awsId: "AKIAI77WCKLJO2LOVXHQ",
  awsSecret: "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",
  awsTag: "ecoecho-20"
});

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

var state = {};
var items = [];
var updated = 'false';

state.view = 'landing';
state.items = items;
state.searchTerm = '';
state.updated = 'false';

router.route('/getCurrentState')
	.get(function (req, res) {
	  res.json({   "view": "home",     "items": [{         "item": {           "id": 1,            "itemName": "item 1",           "price": "10"       }   }, {        "item": {           "id": 2,            "itemname": "item 2",           "price": "15"       }   }],     "searchTerm": "awesome shoes" });
	});

router.route('/getState')
    .get(function (req, res) {
      state.updated = updated;
      updated = 'false';
      res.json(state);
    });

router.route('/search')
    .get(function(req, res){
        var sTerm = req.query.sTerm;
        console.log("Search term = " + sTerm);
        if(sTerm == undefined || sTerm == 'undefined'){
          state.view = 'landing';
          updated = 'true';
          state.updated = updated;
          res.json(state);
        } else {

        client.itemSearch({
          //searchIndex: 'Fashion',
          keywords: sTerm,
          responseGroup: 'ItemAttributes,Offers,Images,Reviews'
        }).then(function(results){
            state.items = [];


          if(results.length > 0){
            var stopAt = results.length > 6? 6 : results.length;
            items = [];
            for (var i = 0; i < results.length - 1 && i < 6; i++) {
                var tItem = {};
                tItem.title = results[i].ItemAttributes[0].Brand[0];
                tItem.price = results[i].ItemAttributes[0].ListPrice[0].FormattedPrice[0];
                tItem.image = results[i].LargeImage[0].URL[0];
                tItem.color = results[i].ItemAttributes[0].Color[0];
                items.push(tItem);
                state.items.push(tItem);
            }
          }
          console.log(results[0].ItemAttributes[0].Brand[0]);
          console.log(results[0].ItemAttributes[0].ListPrice[0].FormattedPrice[0]);
          console.log(results[0].LargeImage[0].URL[0]);
          console.log(results[0].ItemAttributes[0].Color[0]);
          //console.log(results[0].SalesRank);
          state.searchTerm = sTerm;
          state.view = 'home';

          updated = 'true';
          state.updated = updated;
          res.json(state);
        }).catch(function(err){
          console.log(err);
        });}

    });

router.route('/filter')
    .get(function(req,res){
        var fTerm = req.query.filterBy;
        console.log("Filter Term = " + fTerm);
        if(fTerm != '' && fTerm != undefined && fTerm != 'undefined'){
            state.items = [];
            for (var i = 0; i < items.length && state.items.length < 4; i++) {
                //console.log(i + ':' + items[i].color.indexOf(fTerm));
                if(items[i].color.toLowerCase().indexOf(fTerm.toLowerCase()) > -1){
                    state.items.push(items[i]);
                }
            }
            state.view = 'filter';
            updated = 'true';
            state.updated = updated;
        }
        res.json(state);
    });

router.route('/compare')
    .get(function(req,res){
        var maxPrice = 0;
        var minPrice = 0;
        var maxitem;
        var minitem;
        state.items = [];

        for (var i = 0; i < items.length; i++) {
            var price = parseInt(items[i].price.substring(1));
            if(price > maxPrice){
                maxitem = i;
                maxPrice = price;
            }
            if(price < minPrice || minPrice == 0){
                minitem = i;
                minPrice = price;
            }
        }
        state.items.push(items[minitem]);
        if(minPrice != maxPrice){
            state.items.push(items[maxitem]);
        }
        state.view = 'compare';
        updated = 'true';
        state.updated = updated;

        res.json(state);

    });

router.route('/reset')
    .get(function(req,res){
        state = {};
        items = [];

        state.view = 'landing';
        state.items = items;
        updated = 'true';
        state.updated = updated;
        state.searchTerm = '';

        res.json(state);
    });

router.route('/select')
    .get(function(req,res){
        var choice = req.query.choice;
        var finalItem;
        choice = parseInt(choice);
        if(choice != 0){
            choice = choice - 1;
        }

        if(choice < state.items.length){
            finalItem = state.items[choice];
        } else if(state.items.length != 0){
            finalItem = state.items[0];
        }

        state.view = 'final';
        state.items = finalItem;
        updated = 'true';
        state.updated = updated;

        res.json(state);
    });

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/api', router);

app.listen(8001, function () {
  console.log('Example app listening on port 8001!')
});