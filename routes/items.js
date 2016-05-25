'use strict';

var express = require('express');
var router = express.Router();

var Item = require('../models/item');
var User = require('../models/user');

router.get('/', (req, res) => {
    Item.find({}, (err, items) => {
        res.status(err ? 400 : 200).send(err || items);
    });
});

router.get('/:id', (req, res) => {
    Item.findById(req.params.id, (err, item) => {
        res.status(err ? 400 : 200).send(err || item);
    });
});

router.post('/', User.isAdmin, (req, res) => {
    var item = new Item(req.body);

    item.save((err, savedItem) => {
        res.status(err ? 400 : 200).send(err || savedItem);
    });
});

router.delete('/:id', User.isAdmin, (req, res) => {
    Item.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send();
        }
    });
});

router.put('/:id', User.isAdmin, (req, res) => {
    Item.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, (err, item) => {
        res.status(err ? 400 : 200).send(err || item);
    });
});

module.exports = router;