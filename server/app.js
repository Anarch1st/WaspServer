const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const ensureLoggedIn = require('connect-ensure-login');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./data/repo/users');
// const Users = require(path.resolve(__dirname,'./repo/users.js'));

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

const app = express();
const httpServer = http.createServer(app);

app.set('trust-proxy', 1);

app.use(express.json());
app.use(cookieParser());
app.use(session({secret: "WaspberrySpeaking",
				 resave: false,
				 saveUninitialized: false,
				 cookie: {secure: true}}));
app.use(express.urlencoded({ extended: false }));
app.use('/',express.static(path.join(__dirname, '../public')));

passport.use(new LocalStrategy(function(username, password, done){
	Users.findByUsername(username, function(user) {
		if (user) {
			if (user.password === password) {
				return done(null, user);
			} else {
				return done(null, false, {message: "Incorrect Password"});
			}
		} else {
			return done(null, false, {message: "User not found"});
		}
	});
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

app.post('/login', passport.authenticate('local', {failureFlase: true}), function(req, res){
	res.send("Hello "+req.user.username);
});

app.get('/logout', function(req, res) {
	req.logout();
	res.send("Logout");
});
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.get('/', function(req, res){
// 	res.send("hello world");
// });
app.get('/profile',ensureLoggedIn.ensureLoggedIn('/login'), function(req, res){
	res.send(req.user);
});

httpServer.listen(process.env.PORT || 8000, function() {
	console.log("Server started on port: "+httpServer.address().port);
});
