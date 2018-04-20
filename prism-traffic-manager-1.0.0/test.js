const express = require('express');
const server = express();
const trafficManager = require('./index');

let tmConfig = {
    secret: '315cc068-1c2e-4aae-b620-4217587676f4',
    trafficManagerUrl: 'https://traffic-manager.p4d.cloud.slb-ds.com/api/hosts/drillops-portal-localhost',
    clientUrl: 'http://localhost:5000/'
}


server.use('/*', trafficManager(tmConfig, false));
server.use('/', (req, res, next) => {
    res.write('Hello TM');
    res.end();
});

server.listen(5000, () => console.log('server listening on port 5000'));