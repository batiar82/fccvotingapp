'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    _creator : { type: Number, ref: 'User' },
    question: String,
    options: [],
    votes: []
});

module.exports = mongoose.model('Poll', Poll);
