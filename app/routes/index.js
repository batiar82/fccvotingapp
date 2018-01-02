'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			console.log("Entro a poner el true en auth");
			res.locals.auth=true;
			app.locals.auto=true;
			res.app.locals.autori=true;
			return next();
		} else {
			res.redirect('/login');
		}
	}
	function isLoggedInForApi (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.json({error:"Not allowed"});
		}
	}
/*	function meterVar(req,res,next){
		console.log("Meto variable");
		res.locals.autorizo=true;
		return next();
	}
*/	

	var clickHandler = new ClickHandler();
	var pollHandler = new PollHandler();

	app.use(function (req, res, next) {
		console.log('Time:', Date.now());
		res.locals.isAuthenticated=req.isAuthenticated() || false;
		if (req.isAuthenticated())
			res.locals.loggedUser=req.user;
	next();
	});
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
	app.route('/api/poll/delete')
		.post(isLoggedInForApi,pollHandler.deletePoll);
	app.route('/poll/api/:id')
		.get(pollHandler.getPollJson);
	app.route('/poll/get/:id')
		.get(function (req, res) {
			//res.locals.auth2=true;
			res.render('pollnew.html',{id: req.params.id});
		});
};