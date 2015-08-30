var _ = require('lodash');

var EventEmitter = require('events').EventEmitter;
var AppConstants = require('')
var DataStore = merge(EventEmitter.prototype, {

  addChangeListener: function(callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },

  emitChange: function() {
    this.emit(AppConstants.CHANGE_EVENT);
  },

  getCurrentPortfolioItem:function(){

  }

});

module.exports = DataStore;
