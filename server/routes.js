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
    var router = express.Router();
    var fs = require('fs');
    var path = require('path');
    /* Custom modules */
    require('./tools.js')();
    require('./configuration.js')();

    var jConf = getConfigurationJson();

    /* GET home page. */
    router.get('/', function(req, res) {
        fs.mkdir(tmp_dir(current_user(req)), function() {
            console.log('Accessed tmp dir -> ' + tmp_dir(current_user(req)));
            res.render('index');
        });
    });

    /* Serve the Tree */
    router.get('/api/tree', function(req, res) {
        var _p;
        if (req.query.id == 1) {
            _p = home_dir(current_user(req));
            processReq(_p, res);

        } else {
            if (req.query.id) {
                _p = req.query.id;
                processReq(_p, res);
            } else {
                res.json(['No valid data found']);
            }
        }
    });

    /* Serve a Resource */
    router.get('/api/resource', function(req, res) {
        res.send(fs.readFileSync(req.query.resource, 'UTF-8'));
    });

    /* Journald Service Status */
    router.get('/api/service/status', function(req, res) {
        if (jConf.journal_access === true) {
            var service = req.query.service;
            if (!service) {
                res.send("Failed to run command on server");
            }
            var exec = require('child_process').exec;
            var stdout = "";
            var child = exec(scripts_dir() + 'systemctl-unit.sh ' + service + ' ' + tmp_dir(current_user(req)));
            if (!child) {
                res.send("Failed to run command on server");
            }
            child.stdout.on('data', function(data) {
                stdout += data;
            });
            child.stderr.on('data', function(data) {
                stdout = "Failed to run command on server";
            });
            child.on('close', function(code) {
                stdout = stdout.replace(/Active:/, '').trim();
                res.send(stdout);
            });
        } else {
            res.status(404).send("Unsupported api");
        }
    });

    /* SVG Generation API */
    router.get('/api/gen-svg', function(req, res) {
        var spawn = require('child_process').spawn;
        var code = req.query.code;
        var stdout = "";
        var error = false;

        if (code) {
            execOnServer('echo "' + code + '" > ' + tmp_dir(current_user(req)) + 'fbp_svg.fbp', function (returns) {
                var child_dot = spawn('sol-fbp-to-dot', ['--fbp', tmp_dir(current_user(req)) + 'fbp_svg.fbp',
                                     '--dot', tmp_dir(current_user(req)) + 'fbp_runner.dot']);
                child_dot.stderr.on('data', function(data) {
                    error = true;
                    stdout = "Failed to run sol-fbp-to-dot on server";
                });
                child_dot.on('close', function(code) {
                    if (error === true) {
                        res.send(stdout);
                    } else {
                        var child_svg =  spawn('dot', ['-Tsvg', tmp_dir(current_user(req)) + 'fbp_runner.dot']);
                        child_svg.stdout.on('data', function(data) {
                            stdout += data;
                        });
                        child_svg.stderr.on('data', function(data) {
                            stdout = "Failed to run dot command";
                        });
                        child_svg.on('close', function(code) {
                            res.send(stdout);
                        });
                    }
                });
            });
        } else {
            res.status(400).send("ERROR: fbp code should not be null");
        }
    });

    /* Journald route */
    router.get('/api/journald', function(req, res) {
        if (jConf.journal_access === true) {
            var spawn = require('child_process').spawn;
            var stdout = "";
            var error = false;
            var unit_name = req.query.unit_name;
            var child;
            if (!unit_name) {
                child = spawn('journalctl',
                                  ['-o', 'json-pretty', '--since=15 min ago', '--no-pager']);

                child.on('error', function(err) {
                    error = true;
                });
                child.stdout.on('data', function(data) {
                    stdout += data;
                });
                child.stderr.on('data', function(data) {
                    error = true;
                });
                child.on('close', function(code) {
                    if (!error) {
                        var parsed = parseJournaldToJSON(current_user(req), stdout);
                        res.send(parsed);
                    } else {
                        res.send("Unable to get journald, it may be empty.");
                    }
                });
            } else {
                var script = scripts_dir() + "/journalctl-unit.sh";
                child = spawn(script,
                              [tmp_dir(current_user(req))]);
                child.on('error', function(err) {
                    error = true;
                });
                child.stdout.on('data', function(data) {
                    stdout += data;
                });
                child.stderr.on('data', function(data) {
                    error = true;
                });
                child.on('close', function(code) {
                    if (!error) {
                        var parsed = parseJournaldToJSON(current_user(req), stdout);
                        res.send(parsed);
                    } else {
                        res.send("Unable to get journald, it may be empty.");
                    }
                });
            }
        } else {
            res.status(404).send("Unsupported api");
        }
    });

    router.get('/api/file/write', function(req, res) {
        var file_path = req.query.file_path;
        var file_body = req.query.file_body;
        if (!file_path || !file_body) {
            res.status(400).send("Failed to get file path or its body");
        } else {
            if(!writeFile(file_path, file_body)) {
                res.sendStatus(0);
            } else {
                res.status(400).send("Failed to write file " + file_path.split("/").pop());
            }
        }
    });

    /* API run FBP */
    router.post('/api/fbp/run', function(req, res) {
        if (jConf.run_fbp_access === true) {
            var exec = require('child_process').exec;
            var code = req.body.params.code;
            var conf = req.body.params.conf;
            if (!code) {
                res.sendStatus(1);
            } else {
                var child;
                var stdout = "";
                var err = writeFile(tmp_dir(current_user(req)) + "fbp_runner.fbp", code);
                if (err) {
                    console.log('Write File error');
                    res.sendStatus(1);
                } else {
                    var script = scripts_dir() + "/fbp-runner.sh";
                    script = script + ' start ' + tmp_dir(current_user(req));
                    if (conf) {
                        script = script + " " + conf;
                    }
                    console.log("SCRIPT->" + script);
                    getConfigureFile(current_user(req), conf, function (error) {
                        child = exec("sh " + script);
                        child.stdout.on('data', function(data) {
                            stdout += data;
                            console.log('stdout: ' + data);
                        });
                        child.stderr.on('data', function(data) {
                            console.log('stderr: ' + data);
                        });
                        child.on('close', function(code) {
                            console.log('closing code: ' + code);
                            res.sendStatus(code);
                        });
                    });
                }
            }
        } else {
            res.status(404).send("Unsupported api");
        }
    });

    //SOL_FLOW_MODULE_RESOLVER_CONFFILE=sol-flow-new.json sol-fbp-runner example.fbp
    router.get('/api/check/fbp', function(req, res) {
        var spawn = require('child_process').spawn;
        var code = req.query.code;
        var conf = req.query.conf;
        if (!code) {
            res.send("Error: Empty should not being checked!");
        } else {
            var child;
            var error;
            var stdout = "";
            var err = writeFile(tmp_dir(current_user(req)) + "fbp_syntax.fbp", code);
            if (err) {
                console.log('Write File error');
                res.send(err);
            }
            console.log('Running command sol-fbp-runner -c '+ tmp_dir(current_user(req)) + 'fbp_syntax.fbp');
            if (conf) {
                child = spawn("sol-fbp-runner",  ['-c',  tmp_dir(current_user(req)) + 'fbp_syntax.fbp'],
                              {env: {SOL_FLOW_MODULE_RESOLVER_CONFFILE: conf}});
            } else {
                child = spawn("sol-fbp-runner",  ['-c', tmp_dir(current_user(req)) + 'fbp_syntax.fbp']);
            }
            child.on('error', function(err) {
                error = true;
            });
            child.stdout.on('data', function(data) {
                stdout += "Syntax OK";
                console.log('stdout: ' + data);
            });
            child.stderr.on('data', function(data) {
                console.log('stderr: ' + data);
                if (data) {
                    if (stdout) {
                        stdout += data;
                    } else {
                        stdout += "\n" + data;
                    }
                } else {
                    stdout = "Unidentified error.";
                }
            });
            child.on('close', function(code) {
                if (!error) {
                    console.log('closing code: ' + code);
                    res.sendStatus(stdout);
                } else {
                    res.sendStatus("Failed to run command on server");
                }
            });
        }
    });

    /* Git Synch */
    router.post('/api/git/repo/sync', function(req, res) {
        var repo_url = req.body.params.repo_url;
        if (!repo_url) {
            res.status(400).send("Failed to get repository owner  or " +
                                 "repository names or its path.");
        } else {
            var fs = require('fs');
            var repo_name = getRepoName(repo_url);
            var server_name = getServerName(repo_url);
            var repo_path = home_dir(current_user(req)) + server_name + "/" + repo_name;
            var tmp_path = tmp_dir(current_user(req)) + server_name + "/" + repo_name;
            execOnServer("rm -rf " + tmp_path, function(returns) {
                if (returns.error === true) {
                    res.status(400).send(returns.message);
                } else {
                    execOnServer("git clone --quiet " + repo_url + " " + tmp_path,
                    function(returns) {
                        if (returns.error === true) {
                            res.status(400).send(returns.message);
                        } else {
                            execOnServer("mkdir -p " + repo_path +
                                         " && cp -r " + tmp_path + "/* " + repo_path +
                                         " && rm -rf /tmp/" + server_name,
                            function(returns) {
                                res.send(returns.message);
                            });
                        }
                    });
                }
            });
        }
    });

    router.post('/api/git/repo/remove', function (req, res) {
        var repository_path = req.body.params.repo_path;
        if (!repository_path) {
            res.status(400).send("Failed to get repository name or its path.");
        }
        execOnServer('rm -rf ' + repository_path, function(returns) {
            if (returns.error === true) {
                res.status(400).send("Failed to run command on server");
            } else {
                res.send(returns.message);
            }
        });
    });

    router.post('/api/git/repo/commit', function (req, res) {
        var commit_message = req.body.params.commit_message;
        var branch = req.body.params.branch;
        var user = req.body.params.user;
        var pass = req.body.params.password;
        var repo = req.body.params.repo;
        var repo_owner = req.body.params.repo_owner;
        var github = require('octonode');
        var path = require('path');
        var _p = home_dir(current_user(req));
        var git_dir = _p + "/" + repo_owner + "/" + repo;
        var client = github.client({
                                    username: user,
                                    password: pass
                                   });
        client.get('/user', function (err, status, body) {
            if (typeof status === 'undefined') {
                res.status(400).send("Verify login or password");
            } else {
                if (typeof status === 'undefined') {
                    res.status(404).send("Error: File not found on github");
                } else {
                    execOnServer('git --git-dir=' + git_dir + '/.git add .', function(returns) {
                        if (returns.error === true) {
                           res.status(400).send("Failed to run command on server");
                        } else {
                            execOnServer('git --git-dir=' + git_dir + '/.git commit -m "' + commit_message + '"' , function(returns) {
                                if (returns.error === true) {
                                   res.status(400).send("Failed to run command on server");
                                } else {
                                    execOnServer('git --git-dir=' + git_dir + '/.git push https://' + user +
                                                 ':' + pass + '@github.com/' + repo_owner + '/' + repo +
                                                 '.git', function(returns) {
                                        if (returns.error === true) {
                                           res.status(400).send("Failed to run command on server");
                                        } else {
                                            res.sendStatus(0);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    });

    router.post('/api/git/repo/create/folder', function (req, res) {
        var folder_path = req.body.params.folder_path;
        if (!folder_path) {
            res.status(400).send("Failed to get folder path and its name");
        }
        execOnServer('mkdir ' + folder_path, function(returns) {
            if (returns.error === true) {
                res.status(400).send("Failed to run command on server");
            } else {
                res.send(returns.message);
            }
        });
    });

    router.post('/api/git/repo/create/file', function (req, res) {
        var file_path = req.body.params.file_path;
        if (!file_path) {
            res.status(400).send("Failed to get file path and its name");
        }
        execOnServer('touch ' + file_path, function(returns) {
            if (returns.error === true) {
                res.status(400).send("Failed to run command on server");
            } else {
                res.send(returns.message);
            }
        });
    });

    router.post('/api/git/repo/delete/file', function (req, res) {
        var file_path = req.body.params.file_path;
        if (!file_path) {
            res.status(400).send("Failed to get file path and its name");
        } else {
            execOnServer('rm -rf ' + file_path, function(returns) {
                if (returns.error === true) {
                    res.status(400).send("Failed to run command on server");
                } else {
                    res.send(returns.message);
                }
            });
        }
    });

    router.get('/api/configuration', function (req, res) {
        try {
            res.send(getConfigurationJson());
        } catch (err) {
            res.status(400).send(err);
        }
    });

    router.post('/api/fbp/stop', function (req, res) {
        if (jConf.run_fbp_access === true) {
            var exec = require('child_process').exec;
            var child;
            var script = scripts_dir() + "/fbp-runner.sh";
            script = script + ' stop ' + tmp_dir(current_user(req));
            child = exec("sh " + script);
            child.on('close', function(code) {
                console.log('closing code: ' + code);
                res.sendStatus(code);
            });
        } else {
            res.status(404).send("Unsupported api");
        }
    });

    module.exports = router;
}());
