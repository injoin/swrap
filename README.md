# swrap [![Build Status](https://travis-ci.org/injoin/swrap.png?branch=master)](https://travis-ci.org/injoin/swrap)

Simple Node service wrapper, with basic support for configs and classes.
Example:

```javascript
var swrap = require( "swrap" );
var appwrapper = swrap.app(); // or new wrap.app();

// ...initialize your services, for example express, mongoose, restify, etc:
appwrapper.set( "http", expressApp );
appwrapper.set( "db", mongoose );

// later you can get them:
mongoose = appwrapper.get( "db" );

// We parse configuration JSONs with CJSON, so if you want, comment'em!
appwrapper.config.load( "config/commented.json" );
appwrapper.config.get( "my.nested.config.is.awesome" ); // => the value of your config!
```

## Installation
```shell
npm install swrap
```

## Tests
Execute the following commands to get the tests running in swrap:

```shell
npm install -d
npm test
```

## License
MIT
