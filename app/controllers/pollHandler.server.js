'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');


function PollHandler () {

	this.getPolls = function (req, res) {
		Polls
			.find({}).populate('creator').exec(function(err, polls) {
				if (err) { throw err; }
				res.render('index.html',{polls: polls});
			});
	};

	this.addPoll = function (req, res) {
		console.log("es array: "+Array.isArray(req.body.option));
		console.log("Separo "+req.body.option.length);
		console.log("Me piden crear un nuevo poll: "+req.user.github.id+" question: "+req.body.question+" options: "+req.body.option+" req option: "+req.option);
		var newPoll = new Polls();
					
					newPoll.creator = req.user._id;
					newPoll.question = req.body.question;
					newPoll.options = req.body.option;
					//Borro el ultimo que viene vacio, habria que sacarlo y que directamente no lo mande el form
					newPoll.options.pop();
					newPoll.options.forEach(function(item,index){
						newPoll.votes.push(0);
					});
					newPoll.save(function (err) {
						if (err) {
							throw err;
						}
						res.redirect('/');
					});
	};

	this.addOption = function (req, res) {
		console.log("Body: "+req.body+"  "+req.body.option+" req option: "+req.option);
		Polls
			.findOneAndUpdate({ 'poll._id': req.poll.id },{ $push: { options: req.option }})
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result);
				}
			);
	};
	this.deletePoll = function (req, res) {
		Polls
			.findOneAndRemove({ 'poll._id': req.poll.id })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result);
				}
			);
	};
	this.vote = function (req, res) {
		console.log("Tengo que votar el poll: "+req.params.id+" Opcion "+req.body.option);
		var optionObject={};
		optionObject['votes.'+parseInt(req.body.option)]=1;
		console.log(optionObject);
		Polls
			//.findOneAndUpdate({ 'poll._id': req.params._id },{ $inc: {'votes['++']': 1}, "$position": 2})//parseInt(req.body.option)})
			.findByIdAndUpdate(req.params.id,{ $inc: optionObject},{new: true},function (err, result) {
					if (err) { throw err; }
					//this.getPoll
					res.render('poll.html',{poll: result});
				}
			);
	};
	this.getPoll = function (req, res) {
		console.log("Busco el poll con id "+req.params.id);
		Polls
		.findById(req.params.id).exec(function(err, poll) {
				if (err) { throw err; }
				res.render('poll.html',{poll: poll});
			});
	};
	this.getMyPolls = function (req, res) {
		console.log("Busco mis polls "+req.user.github.id);
		Polls
		.find({"creator": req.user._id}).exec(function(err, polls) {
				if (err) { throw err; }
				res.render('mypolls.html',{polls: polls});
			});
	};
}

module.exports = PollHandler;
