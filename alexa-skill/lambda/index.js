'use strict';

var Alexa = require('alexa-sdk');
var ShopperHelper = require('./shopper-helper');
var APP_ID = 'amzn1.ask.skill.51771acb-d885-4846-ada1-34204eb931f0';

var searchTerm = '';
var filterTerm = '';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    //alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
	'LaunchRequest': function() {
		var shopperHelper = new ShopperHelper();
		var thisObj = this;
		shopperHelper.reset()
	      .then(function(returned){
			thisObj.emit(':ask', 'Welcome to Viz Shopper. What do you want to search for?');
	    })
	     .catch(function(err){
	     	console.log(err);
		    thisObj.emit(':tell', 'I\'m having trouble right now. Ask me again later.');
	    });
	},
	'SearchIntent': function(){
		var shopperHelper = new ShopperHelper();
		var thisObj = this;
		searchTerm = this.event.request.intent.slots.search.value;
		console.log("In SearchIntent: searchTerm = " + searchTerm);

		var len;

		shopperHelper.searchFor(searchTerm)
	      .then(function(returned){
			len = returned.body.items.length;
			
  			// Create Speech Output
  			console.log("In SearchIntent: number of items returned = " + len);
  			thisObj.emit(':ask', 'Here are ' + len + ' ' + searchTerm);
	    })
	     .catch(function(err){
	     	console.log(err);
		    thisObj.emit(':tell', 'I\'m having trouble right now. Ask me again later.');
	    });
	},
	'FilterIntent': function(){
		var shopperHelper = new ShopperHelper();
		var thisObj = this;
		filterTerm = this.event.request.intent.slots.filter.value;
		console.log("In FilterIntent: filterTerm = " + filterTerm);

		var len;

		shopperHelper.filterItems(filterTerm)
	      .then(function(returned){
			len = returned.body.items.length;
			
  			// Create Speech Output
  			console.log("In FilterIntent: number of items returned = " + len);
  			thisObj.emit(':ask', 'Here are ' + len + ' ' + filterTerm + ' ' + searchTerm);
	    })
	     .catch(function(err){
	     	console.log(err);
		    thisObj.emit(':tell', 'I\'m having trouble right now. Ask me again later.');
	    });
	},
	'CompareIntent': function(){
		var shopperHelper = new ShopperHelper();
		var thisObj = this;

		shopperHelper.compareItems()
	      .then(function(returned){
  			thisObj.emit(':ask', 'You might like these ' + searchTerm);
	    })
	     .catch(function(err){
	     	console.log(err);
		    thisObj.emit(':tell', 'I\'m having trouble right now. Ask me again later.');
	    });
	},
	'SelectIntent': function() {
		var shopperHelper = new ShopperHelper();
		var thisObj = this;
		var choice = this.event.request.intent.slots.choice.value;
		console.log("In SelectIntent: choice = " + choice);

		var num = "";
		if(choice == "1st") {
			num = 1;
		} else {
			num = 2;
		}

		console.log('Number selected: ' + num);

		shopperHelper.selectItems(num)
	      .then(function(returned){
  			thisObj.emit(':tell', 'Here is your selected item.');
	    })
	     .catch(function(err){
	     	console.log(err);
		    thisObj.emit(':tell', 'I\'m having trouble right now. Ask me again later.');
	    });
	},
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can start by searching for a product.";
        var reprompt = "Try saying Search for Bags.";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StartOverIntent': function() {
    	this.emit(':tell', 'You can never go back.');
    }
}