// This file is part of the Soletta Project
//
// Copyright (C) 2015 Intel Corporation. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
//   * Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in
//     the documentation and/or other materials provided with the
//     distribution.
//   * Neither the name of Intel Corporation nor the names of its
//     contributors may be used to endorse or promote products derived
//     from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
(function() {
    'use strict';

    var express = require('express');
    var path = require('path');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var uuid = require('node-uuid');

    var routes = require('./routes.js');
    require('./configuration.js')();

    try {
        var app = express();
        var jConf;
        var args = process.argv.slice(2);
        var server = process.argv.slice(1)[0];
        if (args.length === 0 || server.indexOf("protractor")) {
            jConf = getConfigurationJson();
        } else {
            jConf = getConfigurationJson(args[0]);
        }

        if (jConf.session_system === true) {
            var session = require('express-session');
            var SessionStore = require('session-file-store')(session);
            app.use(session({
                genid: function(req) {
                    // uuid for guest session ids
                    var id = uuid.v4();
                        console.log("New session: " + id);
                    return id;
                },
                name: "dad-session",
                secret: 'keepitsecret',
                resave: true,
                saveUninitialized: true,
                store: new SessionStore({
                    retries: 500,
                    minTimeout: 150,
                    maxTimeout: 200,
                    path: jConf.sessions_dir
                })
            }));
        }

        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');

        if (jConf.server_output) {
            app.use(logger('dev'));
        }
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(cookieParser());

        app.use(express.static(path.join(__dirname, '../client')));

        app.use('/', routes);

        app.set('port', process.env.PORT || jConf.server_port);

        var server = app.listen(app.get('port'), function() {
            if (jConf.server_output) {
                console.log('Express server listening on port ' + server.address().port);
            }
        });

        module.exports = app;
    } catch (err) {
      console.log(err);
      console.log("Server start failed.");
    }
}());
