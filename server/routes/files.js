const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

var basePath;
if(process.env.NODE_ENV === "production") {
  basePath = '/media/pi';
}else {
  basePath = '/home/saii';
}

router.get('/get/*', function(req, res) {
  let path = basePath + req.url.substring(4);

  fs.readdir(path, function(err, files) {

    if (err) {
      console.log(err.path);
      delete err.path;
      res.send(err);
    } else {
      res.send(files);
    }
  });
});

router.get('/explore', function(req, res) {
  res.sendFile(path.join(__dirname, '../../public/files/explore.html'));
});

module.exports = router;
