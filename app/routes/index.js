'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var cors = require('cors')
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
	//Para Nughtlife app
	app.route('/bars/:city')
		.get(cors(),function (req, res) {
			//res.locals.auth2=true;
			console.log("Busco bares en "+req.params.city);
			var bars=[
			{id: 1, imgUrl:"https://s3-media3.fl.yelpcdn.com/bphoto/o41DEnuTajmpIdOOffuD3g/ms.jpg", nombre:"Verne Club", comentario:"We had a phenomenal experience at Verne Club last week while visiting Buenos Aires. There are a number of 'speakeasy' type of bars in BA and they love the..."				
			},{
				id: 2, imgUrl:"https://s3-media2.fl.yelpcdn.com/bphoto/U-8a8KjrMHheD6pXtISAog/ms.jpg", nombre:"Doppleganger", comentario:"I was in Argentina for a few days and wanted to check out the night life. Food- amazing drinks. I didn't eat much but I did. Have the guacamole and chips.."
			},{
				id: 3, imgUrl:"https://s3-media4.fl.yelpcdn.com/bphoto/R--geuo6sBvZKzvyozx6lA/ms.jpg", nombre:"Floreria atlantico", comentario:"Nice little hidden gem. Couldn't tell the under ground bar from surface, great food, awesome drinks. A must when at Buenos Aires Argentina."
			}			
		];
			res.json(bars);
		});
};