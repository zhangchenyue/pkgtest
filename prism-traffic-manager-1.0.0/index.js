'use strict';
const jwt = require('jsonwebtoken');

module.exports = function (config, cookieSecure = true) {
    let options = config

    let parseCookies = function (request) {
        let list = {},
            rc = request.headers.cookie;

        rc && rc.split(';').forEach(function (cookie) {
            let parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });

        return list;
    };

    let redirectToTrafficManager = function (req, res) {
        let url = options.trafficManagerUrl;

        let pathname = decodeURIComponent(req.originalUrl);
        if (pathname) {
            url += ('?path=' + encodeURIComponent(pathname));
        }
        res.writeHead(302, { 'Location': url });
        res.end();
    };

    let middleware = function (req, res, next) {
        const TRAF_MNG_PARAMETER_NAME = 'traffic-manager-token';
        const TRAF_MNG_COOKIE_NAME = 'tm';

        let token = parseCookies(req)[TRAF_MNG_COOKIE_NAME];
        if (token) {
            next();
            return;
        }
        //Retrieve token from URL or cache (cookie)
        token = req.query[TRAF_MNG_PARAMETER_NAME];

        if (!token) {
            redirectToTrafficManager(req, res);
            return;
        }

        //Validates secret and expiration of token
        jwt.verify(token, decodeURIComponent(options.secret), function (err, decoded) {
            if (err) {
                console.log('Invalid token: ' + err);
                redirectToTrafficManager(req, res);
            }
            else {
                //Validates if user isn't using a token from another application
                if (options.clientUrl != decoded.redirectUrl) {
                    console.log('Invalid redirect. Token has a redirect to  ' + decoded.redirectUrl + ' and was requested from ' + options.clientUrl);
                    redirectToTrafficManager(req, res);
                } else {
                    //Proceeds
                    res.cookie(TRAF_MNG_COOKIE_NAME, token, { maxAge: 1.5 * 60 * 60 * 1000, httpOnly: true, secure: cookieSecure });
                    let regExp = new RegExp('[\\?&]?' + TRAF_MNG_PARAMETER_NAME + '=' + token, 'i');
                    if (req.session && req.session.returnTo) {
                        req.session.returnTo = req.session.returnTo.replace(regExp, '');
                    }
                    req.originalUrl = req.originalUrl.replace(regExp, '');
                    res.writeHead(302, { 'Location': req.originalUrl });
                    res.end();
                }
            }
        });
    };

    return middleware;
};