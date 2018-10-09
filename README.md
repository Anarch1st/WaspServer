# WaspServer
Nodejs server for Raspberry

### Get the source code
```bash
$ git clone git@github.com:Anarch1st/WaspServer.git
$ cd WaspServer
```

### Global dependencies
Node and  empathy installed globally on your machine.

1. Install [nvm](https://github.com/creationix/nvm)
2. Install [node](https://nodejs.org/en/download/) `nvm install 8.12.0`
3. Install [empathy](https://github.com/PolymerLabs/empathy/tree/initial-implementation) globally `npm install @0xcda7a/empathy -g`


### Install the dependencies
Change directory into the new project you just cloned, then install dependencies.
```bash
$ npm install
$ cd public
$ npm install
```

### Run the application
```bash
$ node server/app
Server started on port: 8000
```

### Register and mount a microservice
Perform a post request. This will redirect all requests `http://localhost:8080/mount_path/*` to `http://server_ip/*`.
```javascript
const form = {
    name: 'name_of_the_service',
    path: 'mount_path',
    ip: 'server_ip'
};
request.post('http://localhost:8000/register', {form: form});
```


### Enable/Disable a microservice
Perform a get request. User must be logged in to perform these.
```javascript
request.get('http://localhost:8000/enable/service') // Will enable sevice
request.get('http://localhost:8000/disable/service') // Will disable sevice
```
