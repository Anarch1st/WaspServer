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

router.get('/video', function(req, res) {
  const path = require('os').homedir()+"/Downloads/videoplayback.mp4";
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});

module.exports = router;
