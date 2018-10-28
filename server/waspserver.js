const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./data/repo/users');
const request = require('request');
// const Users = require(path.resolve(__dirname,'./repo/users.js'));

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

const app = express();
const httpServer = http.createServer(app);
const sessionOptions = {
	secret: "WaspberrySpeaking",
	resave: false,
	saveUninitialized: false,
	cookie: {maxAge: 900000}
};

if(process.env.NODE_ENV === "production") {
	const FileStore = require('session-file-store')(session);
	app.set('trust proxy', 1);
	sessionOptions.cookie.secure = true;
	sessionOptions.store = new FileStore();
	app.use(require('compression')());
}

app.use(express.json());
app.use(session(sessionOptions));
app.use(express.urlencoded({ extended: true }));
// app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.use('/',express.static(path.join(__dirname, '../public')));
app.use(function(req, res, next) {
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		if (!req.session.returning) {
			req.session.returning = true;
			request.post('http://localhost:8000/notify/zuk', {form:{title:'New Session', body: ip}});
		}
		next();
	});
passport.use(new LocalStrategy(function(username, password, done){
	Users.findByUsername(username, password, done);
}));

passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	Users.findById(id, function(user){
		if (user) {
			cb(null, user);
		} else {
			cb(null);
		}
	});
});

app.use(passport.initialize());
app.use(passport.session());

var optionalAuth = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    next();
  })(req, res, next);
};

app.post('/login',
 passport.authenticate('local', {
	 failureRedirect: '/login',
	 failureFlase: true
 }),
 function(req, res){
	 if (req.session.returnTo) {
		 res.redirect(req.session.returnTo);
		 delete req.session.returnTo;
	 } else {
		 res.send("Hello "+req.user.username);
	 }
});

app.get('/logout',optionalAuth, function(req, res) {
	var text = "Logout";
	if (req.user) {
		text = text + " "+req.user.username;
	}
	req.logout();
	res.send(text);
});

app.get('/login', function(req, res) {
	res.sendFile(path.resolve(__dirname, '../public/login.html'));
});

app.get('/profile',optionalAuth, function(req, res){
	if (req.user) {
		res.send(req.user);
	} else {
		req.session.returnTo = req.path;
		res.redirect('/login');
	}
});

app.use("*", function(req, res, next) {
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log(ip+"\t"+(req.hasOwnProperty('user'))+"\t"+req.originalUrl);
	next();
});

const indexRouter = require('./routes/index');
app.use('/', optionalAuth, indexRouter);

httpServer.listen(process.env.PORT || 8000, function() {
	console.log("Server started on port: "+httpServer.address().port);
});
