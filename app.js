var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'dist')));

module.exports = app;
