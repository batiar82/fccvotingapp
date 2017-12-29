'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			console.log("Entro a poner el true en auth");
			app.locals.auth="true";
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();
	var pollHandler = new PollHandler();

	app.route('/')
		.get(pollHandler.getPolls)
			//res.sendFile(path + '/public/index.html');

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/addpoll')
		.get(isLoggedIn, function (req, res) {
			console.log("Llaman al form de Polls");
			res.render('pollform.html');
		});
	app.route('/api/:id/polls')
		.get(pollHandler.getPolls)
		.post(isLoggedIn, pollHandler.addPoll)
		.delete(isLoggedIn, pollHandler.deletePoll);
	app.route('/mypolls')
		.get(isLoggedIn, pollHandler.getMyPolls);
		
		
	/*
	app.route('/api/poll')
		.get(isLoggedIn, function (req, res) {
			console.log("Llaman a ver un poll");
			res.sendFile(path + '/public/poll.html');
		});*/
	app.route('/poll/:id')
			.get(pollHandler.getPoll);
			//console.log("Llaman a ver un poll con id "+req.params.id);
			//res.render('poll.html',{options});
			//res.sendFile(path + '/public/poll.html');
	//	});
	app.route('/api/poll/vote/:id')
		.post(pollHandler.vote)
	app.route('/api/poll/addOption')
		.post(isLoggedIn,pollHandler.addOption);
};