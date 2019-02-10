# AuthServer
Nodejs server for Raspberry. This micro-service maintains sessions and authentication. Adds 'User' header to request, to be used by other micro-services to verify a user. Will added more capability and certain level control over other micro-services in the future.

### Get the source code
```bash
$ git clone git@github.com:Saii626/AuthServer.git
$ cd AuthServer
```

### Global dependencies
Node and  empathy installed globally on your machine.

1. Install [nvm](https://github.com/creationix/nvm)
2. Install [node](https://nodejs.org/en/download/) `nvm install 8.12.0`


### Install the dependencies
Change directory into the new project you just cloned, then install dependencies.
```bash
$ npm install
```

### Run the application
```bash
$ node server/authserver
Server started on port: 8000
```
