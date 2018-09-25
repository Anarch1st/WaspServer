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
  const pathStat = fs.statSync(path);

  if(pathStat.isFile()) {
    fs.readFile(path, function(err, data) {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
      return;
    });
  }
  fs.readdir(path, function(err, files) {

    if (err) {
      console.log(err.path);
      delete err.path;
      res.send(err);
    } else {
      var obj = [];

      for (var file of files) {
        const stat = fs.statSync(path+'/'+file);
        obj.push({
          'name': file,
          'isFile': stat.isFile(),
          'size' : stat.size,
          'times' : {
            'birth' : stat.birthtime,
            'access' : stat.atime,
            'modify' : stat.mtime,
            'change' : stat.ctime
          },
          'userId' : stat.uid
        });
      };
      res.send(obj);
    }
  });
});

router.get('/explore', function(req, res) {
  res.sendFile(path.join(__dirname, '../../public/files/explore.html'));
});

module.exports = router;
