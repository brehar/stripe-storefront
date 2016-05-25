'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var moment = require('moment');

var JWT_SECRET = process.env.JWT_SECRET || 'I am a secret.';

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

userSchema.statics.isLoggedIn = (req, res, next) => {
    var token = req.cookies.accessToken;

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return res.status(401).send({error: 'Authentication required.'});

        User.findById(payload._id, (err, user) => {
            if (err || !user) return res.status(401).send({error: 'User not found.'});

            req.user = user;

            next();
        }).select('-password');
    });
};

userSchema.statics.isAdmin = (req, res, next) => {
    if (req.user.admin) {
        next();
    } else {
        res.status(403).send({error: 'Not authorized.'});
    }
};

userSchema.statics.register = (userObj, cb) => {
    User.findOne({email: userObj.email}, (err, dbUser) => {
        if (err || dbUser) return cb(err || {error: 'Email not available.'});

        bcrypt.hash(userObj.password, 12, (err, hash) => {
            if (err) return cb(err);

            var user = new User({
                email: userObj.email,
                password: hash,
                name: userObj.name,
                address: userObj.address
            });

            user.save((err, savedUser) => {
                if (err) return cb(err);

                Mail.sendVerify(savedUser, err => {
                    savedUser.password = null;
                    cb(err, savedUser);
                });
            });
        });
    });
};

userSchema.statics.authenticate = (userObj, cb) => {
    User.findOne({email: userObj.email}, (err, dbUser) => {
        if (err || !dbUser) return cb(err || {error: 'Authentication failed. Invalid email or password.'});

        bcrypt.compare(userObj.password, dbUser.password, (err, isGood) => {
            if (err || !isGood) return cb(err || {error: 'Authentication failed. Invalid email or password.'});

            var token = dbUser.generateToken();

            cb(null, token);
        });
    });
};

userSchema.methods.generateToken = function() {
    var payload = {
        _id: this._id,
        exp: moment().add(1, 'day').unix()
    };

    return jwt.sign(payload, JWT_SECRET);
};

var User = mongoose.model('User', userSchema);

module.exports = User;