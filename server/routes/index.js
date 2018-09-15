const express = require('express');
const path = require('path');
const router = express.Router();

const admin = require('firebase-admin');
const serviceAccount = require('../private/waspserver-firebase.json');

admin.initializeApp( {
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://waspserver-saii.firebaseio.com"
});

const notify = require('./notify');
router.use('/notify', notify);

const test = require('./test');
router.use('/test', test);

module.exports = router;
