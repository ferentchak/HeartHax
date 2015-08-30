/*** @jsx React.DOM */
var React = require('react');
var App = require('./components/app');
var _ = require('lodash');

React.renderComponent(<App />, document.getElementById('main'));
