const express = require('express');
const path = require('path');
const router = express.Router();

const notify = require('./notify');
router.use('/notify', notify);

const test = require('./test');
router.use('/test', test);

const files = require('./files');
router.use('/files', files);

module.exports = router;
