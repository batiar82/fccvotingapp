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
		Polls
			.findByIdAndUpdate(req.body.id,{ $push: { options: req.body.option, votes: 0 }},{new: true})
			.exec(function (err, result) {
					if (err) { 
						console.log("Error");
						throw err; }
					console.log("voy a mandar el resultado "+result);
					res.json(result);
				}
			);
	};
	this.deletePoll = function (req, res) {
		var response={success:false,error:""};
		Polls
			.findById(req.body.id).populate('creator')
			.exec(function (err, result) {
					if (err) { 
						throw err;
						response.error="Poll not found";
						res.json(response);
					}
					else
						if (result.creator._id.equals(req.user._id)){ 
							result.remove();
							response.success=true;
							
						}else{
							response.error="Only creator can delete a poll";
							
						}
						res.json(response);
						
				}
			);
	};
	this.vote = function (req, res) {
		var optionObject={};
		optionObject['votes.'+parseInt(req.body.option)]=1;
		console.log(optionObject);
		Polls
			//.findOneAndUpdate({ 'poll._id': req.params._id },{ $inc: {'votes['++']': 1}, "$position": 2})//parseInt(req.body.option)})
			.findByIdAndUpdate(req.params.id,{ $inc: optionObject},{new: true},function (err, result) {
					if (err) { throw err; }
					//this.getPoll
					res.json(result);
				}
			);
	};
	this.getPoll = function (req, res) {
		console.log("Busco el poll con id "+req.params.id);
		Polls
		.findById(req.params.id).populate('creator').exec(function(err, poll) {
				if (err) { throw err; }
				var canAdd=false;
				if(req.user!= undefined && poll.creator._id.equals(req.user._id))
					canAdd=true;
				res.render('poll.html',{poll: poll, canAdd: canAdd});
			});
	};
	this.getPollJson = function (req, res) {
		console.log("Busco el poll con id "+req.params.id+" para la api");
		Polls
		.findById(req.params.id).populate('creator').exec(function(err, poll) {
				if (err) { throw err; }
				console.log("Devuelvo  "+poll);
				res.json(poll);
			});
	};
	this.getMyPolls = function (req, res) {
		console.log("Busco mis polls "+req.user.github.id);
		Polls
		.find({"creator": req.user._id}).populate('creator').exec(function(err, polls) {
				if (err) { throw err; }
				res.render('mypolls.html',{polls: polls});
			});
	};
}

module.exports = PollHandler;
