const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { exec } = require('child_process');

var basePath;
if(process.env.NODE_ENV === "production") {
  basePath = '/media/pi';
}else {
  basePath = '/home/saii';
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, basePath+ '/'+req.body.path);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

var upload = multer( {storage: storage} );

router.post('/upload', upload.single('file'), function(req, res) {
  res.end();
})

router.get('/video', function(req, res) {
  let filePath = req.session.filePath;

  var stat;
  try {
    stat = fs.statSync(filePath);
  } catch (e) {
    console.log(e);
  }
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1;
    const file = fs.createReadStream(filePath, {start, end});
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

router.get('/file', function(req, res) {
  let filePath = req.session.filePath;
  res.sendFile(filePath, (err) => {
    if (err) {
      res.send(err);
    }
  });
});

router.get('/get/*', function(req, res) {
  let filePath = basePath + decodeURI(req.url.substring(4));
  const pathStat = fs.statSync(filePath);

  if(pathStat.isFile()) {
    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (err) {
        res.send('Insufficient Read permission');
      } else {
        req.session.filePath = filePath;

        exec('file -b -i '+filePath, function(err, stdout, stderr){
          const parts = stdout.split(';');
          res.send({'mime': parts[0], 'encoding': parts[1].substring(1,parts[1].length-1)});
        });
        return;
      }
    });
  } else {
    fs.readdir(filePath, function(err, files) {
      if (err) {
        console.log(err.path);
        delete err.path;
        res.send(err);
      } else {
        var obj = [];

        for (var file of files) {

          if (file.substring(0,1) === '.') {
            if (!req.user) {
              continue;
            }
          }
          const stat = fs.statSync(filePath+'/'+file);
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
  }
});

// router.post()

router.get('/explore', function(req, res) {
  res.sendFile(path.join(__dirname, '../../public/files/explore.html'));
});

module.exports = router;
