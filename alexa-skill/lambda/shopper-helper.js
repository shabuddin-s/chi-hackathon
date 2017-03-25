'use strict';

var rp = require('request-promise');
var ENDPOINT = 'http://528457d7.ngrok.io/api/';

function ShopperHelper() { }


ShopperHelper.prototype.searchFor = function(sTerm) {
  var options = {
    method: 'GET',
    uri: ENDPOINT + 'search?sTerm=' +sTerm,
    resolveWithFullResponse: true,
    json: true,
    timeout: 50000
  };
  return rp(options);
};

ShopperHelper.prototype.filterItems = function(fTerm) {
  var options = {
    method: 'GET',
    uri: ENDPOINT + 'filter?filterBy=' + fTerm,
    resolveWithFullResponse: true,
    json: true,
    timeout: 50000
  };
  return rp(options);
};

ShopperHelper.prototype.compareItems = function() {
  var options = {
    method: 'GET',
    uri: ENDPOINT + 'compare',
    resolveWithFullResponse: true,
    json: true,
    timeout: 50000
  };
  return rp(options);
};

ShopperHelper.prototype.selectItems = function(choice) {
  var options = {
    method: 'GET',
    uri: ENDPOINT + 'select?choice=' + choice,
    resolveWithFullResponse: true,
    json: true,
    timeout: 50000
  };
  console.log("inside selectItems. choice is " + choice);
  return rp(options);
};

ShopperHelper.prototype.reset = function() {
  var options = {
    method: 'GET',
    uri: ENDPOINT + 'reset',
    resolveWithFullResponse: true,
    json: true,
    timeout: 50000
  };
  return rp(options);
};

module.exports = ShopperHelper;