const express = require('express');
const path = require('path');
const router = express.Router();
const httpProxy = require('http-proxy');
const multer = require('multer');
const proxy = httpProxy.createProxyServer();

if (process.env.NODE_ENV === "production") {
  basePath = '/media/pi/PartA/temp';
} else {
  basePath = '/home/saii/temp';
}

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, basePath);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
})

var upload = multer({
  storage: storage
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  if (req.body) {
    // console.log(req.body);
    let bodyData = JSON.stringify(req.body);
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }

});

var microserviceDB = [];

router.post('/register', function(req, res) {
  const mountPath = req.body.path;
  const proxyIP = req.body.ip;
  const name = req.body.name;

  for (var service of microserviceDB) {
    if (service.name === name) {
      service.path = mountPath;
      service.redirect = proxyIP;
      res.status(204);
      res.end();
      return;
    }
  }
  microserviceDB.push({
    path: mountPath,
    redirect: proxyIP,
    name: name,
    enabled: true
  });
  res.status(200);
  res.end();
  return;
});

router.get('/enable/:name', function(req, res) {
  if (!req.user) {
    res.status(401);
    res.send("Login to enable/disable services");
    return;
  }
  for (var service of microserviceDB) {
    if (service.name === req.params.name) {
      service.enabled = true;
      res.send("Enabled " + service.name);
      return;
    }
  }
  res.send("Service not found");
});

router.get('/disable/:name', function(req, res) {
  if (!req.user) {
    res.status(401);
    res.send("Login to enable/disable services");
    return;
  }
  for (var service of microserviceDB) {
    if (service.name === req.params.name) {
      service.enabled = false;
      res.send("Disabled " + service.name);
      return;
    }
  }
  res.send("Service not found");
});

router.use('/', function(req, res) {
  const pathRoute = req.url.split('/');
  if (pathRoute.length == 0) {
    res.send("No microservice on root");
    return;
  }

  var isFound = false;
  for (var service of microserviceDB) {
    if (service.path === pathRoute[1] && service.enabled) {
      console.log("Using service " + service.name);
      isFound = true;
      req.url = req.url.substring(pathRoute[1].length + 1);

      let headers = {
        isSecure: (process.env.NODE_ENV !== "production" || req.isLocal() || req.user) ? true : false,
        roles: req.user ? JSON.stringify(user.roles) : '[]'
      }

      if (req.headers['content-type'] && req.headers['content-type'].split(' ')[0] === 'multipart/form-data;') {
        upload.array('files')(req, res, function(err) {
          if (err) {
            console.log(err);
          } else {
            req.body.files = req.files;
            proxy.web(req, res, {
              target: service.redirect,
              headers: headers
            }, function(err) {
              console.log(service.name + " error: " + err);
            });
          }
        });
      } else {
        proxy.web(req, res, {
          target: service.redirect,
          headers: headers
        }, function(err) {
          console.log(service.name + " error: " + err);
        });
      }
      break;
    }
  }
  if (!isFound) {
    res.send("No matching microservice found");
  }
})

module.exports = router;