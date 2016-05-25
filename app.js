'use strict';

const PORT = process.env.PORT || 3000;

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/stripe-storefront');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('public'));
app.use('/api', require('./routes/api'));

app.listen(PORT, err => {
    console.log(err || `Server listening on port ${PORT}`);
});