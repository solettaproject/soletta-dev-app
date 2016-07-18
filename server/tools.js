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

module.exports = function () {
    var fs = require('fs');
    var path = require('path');
    var multer = require('multer');
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

    this.env_file = function(user) {
        return "/tmp/" + user + '/fbp_run.env';
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
                    if (list[i].charAt(0) !== ".") {
                        resp.push(processNode(_p, list[i]));
                    }
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

    this.generateHiddenPath = function(path) {
        var array_path;
        var fbp_name;
        var fbp_path;

        if (!path) {
            return null;
        }

        array_path = path.split("/");
        fbp_name = array_path.pop();
        fbp_path = array_path.join("/");

        return fbp_path + "/." + fbp_name;
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

    this.removeFolder = function(path) {
        try {
            if(fs.existsSync(path)) {
                fs.readdirSync(path).forEach(function(file, index) {
                  var curPath = path + "/" + file;
                  if(fs.lstatSync(curPath).isDirectory()) {
                    removeFolder(curPath);
                  } else {
                    fs.unlinkSync(curPath);
                  }
                });
                fs.rmdirSync(path);
            }
        } catch (e) {
            return new Error(e)
        }
    };

    this.createEmptyFile = function(path) {
        try {
            fs.closeSync(fs.openSync(path, 'w'));
        } catch (e) {
            return new Error(e)
        }
    };

    this.createFolder = function(path) {
        try {
            fs.mkdirSync(path);
        } catch (e) {
            return new Error(e)
        }
    };

    this.removeFile = function(path) {
        try {
            fs.unlinkSync(path);
        } catch (e) {
            return new Error(e)
        }
    };

    this.parseJournaldToJSON = function(user, output) {
        var i = 0;
        var journald = [];
        var line_block = "";
        var json_block;
        while (i < output.length) {
            var j = output.indexOf("\n", i);
            if (j == -1) {
                j = output.length;
            }
            var line = output.substr(i, j-i).trim();
            i = j + 1;

            line_block = line_block + line;

            if (line === "}") {
                    try {
                        if (line_block.indexOf("-- Reboot --") > -1) {
                            line_block = line_block.replace("-- Reboot --","");
                        }
                        json_block = JSON.parse(line_block);
                        if(json_block.SYSLOG_IDENTIFIER !== "node") {
                            journald.push(json_block);
                        }
                    } catch (err) {
                        console.log(err);
                        console.log(line_block);
                        console.log("Proceeding anyway");
                    }
                line_block = "";
            }
        }
        return journald;
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

    this.isInsideRepo = function(repo_url) {
        if (!repo_url) {
            return false;
        } else {
            if ((repo_url.indexOf("soletta-dev-app") > -1) &&
                 (repo_url.indexOf("repos") > -1)) {
                return true;
            } else {
                return false;
            }
        }
    };

    this.storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, String(req.body.upload_path))
        },
        filename: function(req, file, callback) {
            callback(null, file.originalname)
        }
    });

    this.upload = multer({storage: storage }).single('file');

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
