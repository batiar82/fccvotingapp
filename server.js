'use strict';
console.log("----------------");
console.log("**************   "+process.env);
console.log("----------------");
var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var cors = require('cors')

var app = express();
//require('dotenv').load();
require('./app/config/passport')(passport);
nunjucks.configure('public', {autoescape: true, express: app });
mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
