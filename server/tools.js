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
module.exports = function () {
    var fs = require('fs');
    var path = require('path');
    require('./configuration.js')();

    this.home_dir = function(user) {
        return __dirname + '/../repos/' + user + '/';
    };

    this.tmp_dir = function(user) {
        return "/tmp/" + user + '/';
    };

    this.svg_dir = function() {
        return __dirname + '/../client/imgs/';
    };

    this.scripts_dir = function() {
        return __dirname + '/../scripts/';
    };

    this.current_user = function (req) {
        var jConf = getConfigurationJson();
        if (jConf.session_system === true) {
            return req.sessionID;
        } else {
            return "singlesession";
        }
    };

    this.processReq = function(_p, res) {
        var resp = [];
        fs.readdir(_p, function(err, list) {
            if (list) {
                for (var i = list.length - 1; i >= 0; i--) {
                    resp.push(processNode(_p, list[i]));
                }
            }
            res.json(resp);
        });
    };

    this.processNode = function(_p, f) {
        var s = fs.statSync(path.join(_p, f));
        return {
            "id": path.join(_p, f),
            "text": f,
            "icon" : s.isDirectory() ? 'jstree-custom-folder' :
                'jstree-custom-file',
            "state": {
                "opened": false,
                "disabled": false,
                "selected": false
            },
            "li_attr": {
                "base": path.join(_p, f),
                "isLeaf": !s.isDirectory()
            },
            "children": s.isDirectory()
        };
    };

    this.writeFile = function(path, body) {
        var fs = require('fs');
        var err = fs.writeFileSync(path, body);
        if (err) {
            return true;
        } else {
            return false;
        }
    };

    this.parseJournaldToJSON = function(user, output) {
        var i = 0;
        var k = 5; // message starts on 5
        var journald = "[";
        var found = false;
        var json_block = "";
        while (i < output.length) {
            var j = output.indexOf("\n", i);
            if (j == -1) {
                j = output.length;
            }
            var line = output.substr(i, j-i).trim();
            json_block += line;
            i = j + 1;

            if (/\[.*[^a-zA-Z]+[0-9][0-9]+.*\]/.test(line) === true) {
                found = true;
            }

            if (line.indexOf("}") > -1) {
                if (found === false) {
                    journald += json_block + ",";
                }
                json_block = "";
                found = false;
            }
        }
        journald = journald.substring(0, journald.length - 1);
        journald += "]";
        try {
            var json = JSON.parse(journald);
            return json;
        } catch(err) {
            console.log("Error to parse journal json");
            console.log(err);
            return err;
        }
    };

    this.getConfigureFile = function(user, conf_path, callback) {
        var path = require("path");
        var fs = require('fs');
        var script_folder = scripts_dir();
        var json_path = tmp_dir(user) + "sol-flow.json";
        var stats;
        try {
            stats = fs.lstatSync(json_path);
        } catch (e) {
            console.log("sol-flow.json not found. Continuing anyway...");
        }
        if (conf_path) {
            var command = "ln -s " + conf_path + " " + json_path;
            if (stats) {
                command = "unlink " + " " + json_path + " && " + command;
            }
            execOnServer(command, function(returns) {
                callback(returns.error);
            });
        } else {
            if (stats) {
                execOnServer("unlink " + " " + json_path, function(returns) {
                    callback(returns.error);
                });
            } else {
                callback(false);
            }
        }
    };

    this.execOnServer = function(command, callback) {
        if (!command) {
            callback({error: true, message: "Command is null"});
        }
        var exec = require('child_process').exec;
        if (exec) {
            var child;
            var stdout = "";
            var err = false;
            child = exec(command);
            if (!child) {
                res.send("Failed to run command on server");
            }
            child.stdout.on('data', function(data) {
                console.log("repo " + data);
                stdout += data;
            });
            child.stderr.on('data', function(data) {
                console.log("repo " + data);
                stdout += data;
                err = true;
            });
            child.on('close', function(code) {
                console.log("stdout repo " + stdout);
                callback({error: err, message: stdout});
            });
        }
    };

    this.getRepoName = function(repo_url) {
        var url = repo_url.split("/").pop().split(".git")[0];
        if (url.indexOf(":") >= 0) {
            url = url.split(":").pop().split(".git")[0];
        }
        return url;
    };

    this.getServer = function(server, name) {
        if (server) {
            if (name.indexOf("@") >= 0) {
                return server + "/" + name.split(":")[1].split("/")[0];
            } else {
                return server + "/" + name;
            }
        } else {
            if (name.indexOf("@") >= 0) {
                  return name.split("@")[1];
              } else {
                  return name;
              }
        }
    };

    this.getPathSystemdFormatted = function(current_user, callback) {
        execOnServer("systemd-escape "+ tmp_dir(current_user),
            function(returns) {
                callback(returns.message);
            }
        );
    };

    this.getServerName = function(repo_url) {
        var url_array = repo_url.split("/");
        var name = url_array.pop();
        if (repo_url.toLowerCase().indexOf("github") >= 0) {
            name = url_array.pop();
            return getServer("github", name);
        } else if (repo_url.toLowerCase().indexOf("bitbucket") >= 0) {
            name = url_array.pop();
            return getServer("bitbucket", name);
        } else {
            if (name.indexOf(":") >= 0) {
                url_array = name.split(":");
                return getServer(null, url_array[0]);
            } else {
                return getServer(null, url_array.pop());
            }
        }
    };
};
