const express = require('express');
const path = require('path');
const router = express.Router();

// TODO: Move this to notify after being done with /test
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

const files = require('./files');
router.use('/files', files);

module.exports = router;
