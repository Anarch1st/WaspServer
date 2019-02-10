const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');
const session = require('express-session');
const UserService = require('./user/UserService');
const User = require('./user/User');
let userService = new UserService();

const debug = require('debug')('auth:server');

const app = express();
const httpServer = http.createServer(app);
const sessionOptions = {
  secret: "WaspberrySpeaking",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 15 //15 min
  }
};

if (process.env.NODE_ENV === "production") {
  const pg = require('pg');
  let pgPool = new pg.Pool({
    user: (process.env.NODE_ENV === 'production') ? 'pi' : 'saii',
    host: 'localhost',
    database: 'pi_db',
    password: 'pi_db_pass',
    port: 5432
  });

  const PostgresSessionStore = require('connect-pg-simple')(session);
  app.set('trust proxy', 1);

  // '/auth' endpoint is internal and called by a http request
  // sessionOptions.cookie.secure = true;
  sessionOptions.store = new PostgresSessionStore({
    pool: pgPool,
    tableName: 'user_sessions'
  });
  app.use(require('compression')());
}

app.use(express.json());
app.use(session(sessionOptions));
app.use(express.urlencoded({
  extended: true
}));

app.use('/', (req, res, next) => {
  req.session.ip = req.headers.ip;
  next();
});

app.use('/', express.static(path.join(__dirname, '../public')));

app.get('/login', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../public/login.html'));
});

app.post('/login', (req, res) => {
  let {
    username,
    password
  } = req.body;

  userService.findByUsername(username, (err, user) => {
    if (!err && user && user.comparePassword(password)) {
      req.session.userId = user.id;
      debug('Login success %s', user.id);
      if (req.session.returnTo) {
        res.redirect(req.session.returnTo);
        delete req.session.returnTo;
      } else {
        res.send({
          status: 'success',
          userId: user.id

        });
      };
    } else {
      debug('Error: %O', err);
      res.send({
        status: 'error',
        error: err
      });
    }
  });
});

app.get('/logout', function (req, res) {
  if (req.session.userId) {
    let userId = req.session.userId;
    delete req.session.userId;

    userService.logoutUser(userId);
    debug('Logout success %s', userId);

    res.send({
      status: 'success',
      userId: userId
    });
  } else {
    res.send({
      status: 'error',
      error: 'not logged in'
    });
  }
});

app.get('/auth', (req, res) => {
  res.status(200);

  let localIPs = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

  if (localIPs.indexOf(req.headers.ip) === -1) {
    if (req.session.userId) {
      userService.findById(req.session.userId, (err, user) => {
        if (err) {
          debug('Error while retriving user %s', req.session.userId);
          res.set('user', 'false');
          res.end();
          return;
        }

        debug('User header set to %s', user.id);
        res.set('user', user.id);
        res.end();
      });
    } else {
      debug('No logged-in user');
      res.set('user', 'false');
      res.end();
    }
  } else {
    debug('Local User');
    res.set('user', 'true');
    res.end();
  }
});

app.post('/addUser', (req, res) => {
  // Available only to logged-in user or a local user
  if (req.headers.user) {
    userService.addUser(req.body.username, req.body.password, {});
    debug('User created');
    res.end();
  } else {
    debug('Untrusted user');
    res.status(401);
    res.end();
  }
});

app.get('/user/:id', (req, res) => {
  if (req.headers.user) {
    userService.findById(req.params.id, (err, user) => {
      if (err) {
        res.send({
          status: 'error',
          error: err
        });
        return;
      }

      res.send({
        status: 'success',
        user: user
      });
    });
  } else {
    debug('Untrusted user');
    res.status(401);
    res.end();
  }
});

httpServer.listen(process.env.PORT || 8000, function () {
  console.log("Server started on port: " + httpServer.address().port);
});