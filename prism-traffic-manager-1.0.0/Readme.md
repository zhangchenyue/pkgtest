# prism-sauth

Expressjs Prism SAuth middleware based on passport.js.

Handle prism sauth requests in a middleware before your handlers, session cookie based result.

**Note** By default the passpoart depend on the session, so you need enable session in your express server

# Dependencices
* `express`
* `passport`
* `passport-strategy`


## Installation
### config your .npmrc to https://artifactory.drillops.slb.com/artifactory/api/npm/npm-repo/
```sh
$ npm install prism-traffic-manager --save
```

### API
```js
var trafficManager = require('prism-traffic-manager')
```

The `trafficManager` object need 2 parameters:
* `[config]` your traffic manager configuration contains
```
  {
    secret: '',
    trafficManagerUrl: '',
    clientUrl: ''
  }
```
* `[cookieSecure]` by default is true (if your server is http, must set to false)

## Examples

This is the simplest setup.

```js
const express = require('express');
const server = express();
const trafficManager = require('./index');

let tmConfig = {
    secret: 'your secret',
    trafficManagerUrl: 'your traffic manager url with groupid',
    clientUrl: 'your callback url'
}


server.use('/*', trafficManager(tmConfig, false));
server.use('/', (req, res, next) => {
    res.write('Hello TM');
    res.end();
});

server.listen(5000, () => console.log('server listening on port 5000'));
```


## License

[SLB](LICENSE)