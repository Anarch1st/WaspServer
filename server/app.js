const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var options = {
	key: fs.readFileSync('~/cert/cert.pem'),
	cert: fs.readFileSync('~/cert/cert.key')
}
const app = express();
const httpServer = http.createServer(app);
const httpsServer = http.createServer(options, app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/',express.static(path.join(__dirname, '../public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.get('/', function(req, res){
// 	res.send("hello world");
// });

httpsServer.listen(process.env.PORT || 8000, function() {
	console.log("Server started on port: "+httpsServer.address().port);
});
