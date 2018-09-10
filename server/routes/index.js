const express = require('express');
const path = require('path');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.resolve(__dirname, '../../public/index.html'));
});

router.get('/login', function(req, res) {
	res.sendFile(path.resolve(__dirname, '../../public/login.html'));
});

module.exports = router;
