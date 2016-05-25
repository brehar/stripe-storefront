'use strict';

var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;