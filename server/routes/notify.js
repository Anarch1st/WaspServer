const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

router.get('/test', function(req, res) {
	var db = admin.database();
	var ref = db.ref('notifications/mobile');

	ref.on('value', function(snapshot) {

	}, function(errorObj) {
		console.log(errorObj.code);
	});

});

module.exports = router;
