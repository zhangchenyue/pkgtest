const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const ensure = require('connect-ensure-login');
const server = express();
const prismSauth = require('./index');

const sauthConfig = {
    encodedClientAuthRequest: 'ODQ0MjgyNDl7ImNsaWVudGlkIjoibGFuZGluZy1sb2NhbGhvc3Q1MDAwLWRyaWxsb3BzdG93bnBvcnRhbC5zbGJhcHAuY29tIiwgInJjYmlkIjoibGFuZGluZy1sb2NhbGhvc3Q1MDAwIiwgInJldHVybnRvIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwLyJ9NTU1MDEwMzI=',
    sauthURL: 'https://sauth-dot-cfsauth-preview.appspot.com/v1/auth',
    tokenServiceApiKey: 'AIzaSyDkZlfehVTPtigUJMvZwecEgRc14Wd8X18',
    tokenServiceURL: 'https://tksvc-dot-cfsauth-preview.appspot.com/v1/code',
}

server.use(bodyParser.urlencoded({ extended: true }));
server.use(require('cookie-session')({ maxAge: 60 * 60 * 1000, secret: 'slb dls' }));

prismSauth(server, passport, sauthConfig);

server.use('/', ensure.ensureLoggedIn({ redirectTo: '/signon', setReturnTo: true }), (req, res, next) => {
    {
        res.write('Hello');
        res.end();
    }
});

server.listen(5000, () => console.log('server listening on port 5000'));