const express = require('express');
const path = require('path');
const router = express.Router();
const { execSync } = require('child_process');

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../../public/index.html'));
});

router.get('/login', function(req, res) {
	res.sendFile(path.resolve(__dirname, '../../public/login.html'));
});

router.get('/test', function(req, res){
  if (req.user) {
	  res.send("Logged in as: "+req.user.username);
  }else {
	  res.send("Not logged in");
  }
});

router.get('/testCI', function(req, res) {
	const commitLog = execSync('git log -n 1').toString('utf8');
	res.send(commitLog);
});

module.exports = router;
