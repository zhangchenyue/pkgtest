# prism-sauth

Expressjs Prism SAuth middleware based on passport.js.

Handle prism sauth requests in a middleware before your handlers, session cookie based result.

**Note** By default the passpoart depend on the session, so you need enable session in your express server

# Dependencices
* `express`
* `passport`
* `passport-strategy`


## Installation

```sh
$ npm install prism-sauth --save
```

## API

<!-- eslint-disable no-unused-vars -->

```js
var prismSauth = require('prism-sauth')
```

The `prismSauth` object need 3 parameters:
* `[server]` your express server instance, passport, config
* `[passport]` your passport instance
* `[config]` your configuration for SAuth, the object model is 
```
  {
   encodedClientAuthRequest: '',
   sauthURL: '',
   tokenServiceApiKey: '',
   tokenServiceURL: '',
  }
```

## Examples

### Express/Connect top-level generic

This example demonstrates adding a generic JSON and URL-encoded parser as a
top-level middleware, which will parse the bodies of all incoming requests.
This is the simplest setup.

```js
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const ensure = require('connect-ensure-login');
const app = express();
const prismSauth = require('prism-sauth');

const sauthConfig = {
    encodedClientAuthRequest: 'your encoded auth request',
    sauthURL: 'your sauth server url',
    tokenServiceApiKey: 'your sauth token service api key',
    tokenServiceURL: 'your sauth token server',
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('cookie-session')({ maxAge: 60 * 60 * 1000, secret: 'slb dls' }));

prismSauth(app, passport, sauthConfig);

app.use('/', ensure.ensureLoggedIn({ redirectTo: '/signon', setReturnTo: true }), (req, res, next) => {
    {
        res.write('Hello');
        res.end();
    }
});

app.listen(5000, () => console.log('server listening on port 5000'));
```


## License

[SLB](LICENSE)