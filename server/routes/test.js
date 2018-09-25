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

router.get('/firebase', function(req, res) {
	const admin = require('firebase-admin');

	var db = admin.database();
	var ref = db.ref('notifications/mobile');

	ref.on('value', function(snapshot) {
			res.send(snapshot.val());
		}, function(errorObj) {
			res.send(errorObj.code);
	});

});


module.exports = router;
