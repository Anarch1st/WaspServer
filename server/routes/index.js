const express = require('express');
const path = require('path');
const router = express.Router();

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

module.exports = router;
