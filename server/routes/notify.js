const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const serviceAccount = require('../private/waspserver-firebase.json');

admin.initializeApp( {
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://waspserver-saii.firebaseio.com"
});

router.get('/test', function(req, res) {
	var db = admin.database();
	var ref = db.ref('notifications/mobile');

	ref.on('value', function(snapshot) {

	}, function(errorObj) {
		console.log(errorObj.code);
	});

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
