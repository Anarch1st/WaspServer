const express = require('express');
const router = express.Router();
const { execSync } = require('child_process');
const fs = require('fs');

router.get('/user', function(req, res){
  if (req.user) {
	  res.send("Logged in as: "+req.user.username);
  }else {
	  res.send("Not logged in");
  }
});

router.get('/CI', function(req, res) {
	const commitLog = execSync('git log -n 1').toString('utf8');
	res.send(commitLog);
});



module.exports = router;
