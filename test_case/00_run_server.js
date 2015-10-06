var http = require('http'),
    server;

before(function() {
    server = http.createServer(require('../server/app.js'));
    browser.baseUrl = 'http://localhost:8080';
});
