// This file is part of the Soletta Project
//
// Copyright (C) 2015 Intel Corporation. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
        if (args.length === 0) {
            jConf = getConfigurationJson();
        } else {
            if (args[0] === 'protractor.config.js') {
                jConf = getConfigurationJson('test_case/configuration_test.json');
            } else {
                jConf = getConfigurationJson(args[0]);
            }
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

        server.once('error', function(err) {
            console.log('Error: Could not run the Soletta Dev-App server (' + err.code + ').');
            if (err.code === 'EADDRINUSE') {
                console.log('Port ' + jConf.server_port + ' is already in use');
            }
        });

        module.exports = app;
    } catch (err) {
      console.log(err);
      console.log("Server start failed.");
    }
}());
