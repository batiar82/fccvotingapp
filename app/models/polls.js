'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    creator : { type: Schema.Types.ObjectId, ref: 'User' },
    question: String,
    options: [],
    votes: []
});

module.exports = mongoose.model('Poll', Poll);
