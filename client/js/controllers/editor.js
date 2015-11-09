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
    app.controller ('RunFBPCode', ['$compile', '$scope', '$http', '$interval',
        '$document', 'broadcastService', 'FetchFileFactory',
        'usSpinnerService', 'svConf',
        function ($compile, $scope, $http, $interval, $document, broadcastService,
                  FetchFileFactory, usSpinnerService, svConf) {
                var isRunningSyntax = false;
                var promiseCheckSyntax;
                var promiseServiceStatus;
                var promiseRunViewer;
                var markId;
                var diag;
                var filePath;
                var currentFile;
                var isLeaf;
                var rootTree;
                var dataTree;
                $scope.syntaxCheckRefreshPeriod = 1100;
                $scope.runConf = false;
                $scope.loginConf = false;
                $scope.runJournal = false;
                $scope.shouldSave = false;
                svConf.fetchConf().success(function(data){
                    $scope.runConf = data.run_fbp_access;
                    $scope.loginConf = data.login_system;
                    $scope.runJournal = data.journal_access;
                    $scope.runDialogRefreshPeriod = parseInt(data.run_dialog_refresh_period);
                    $scope.syntaxCheckRefreshPeriod = parseInt(data.syntax_check_refresh_period);
                    $scope.refreshPeriod = parseInt(data.fbp_service_status_refresh_period);
                    if ($scope.runJournal === true) {
                        $scope.startServiceStatus();
                    }
                });
                $scope.libChecked = true;
                $scope.codeChecked = true;
                $scope.svgChecked = true;
                $scope.logged = false;
                $scope.fbpType = true;
                $scope.isServiceRunning = false;
                var editor = ace.edit("fbp_editor");
                var aceConfig = require("ace/config");
                var modelist = ace.require("ace/ext/modelist");
                editor.setOptions({
                    autoScrollEditorIntoView: true
                });
                editor.commands.removeCommand("showSettingsMenu");
                editor.$blockScrolling = Infinity;
                editor.session.setOption("useWorker", false);
                editor.setFontSize(15);
                editor.setTheme('ace/theme/monokai');
                editor.keyBinding.origOnCommandKey = editor.keyBinding.onCommandKey;

                $scope.fbpType = true;
                aceConfig.set("modePath", "js/ace/");
                editor.getSession().setMode("ace/mode/fbp");
                $scope.fileViewer = '# Write FBP Code here.';
                $scope.buttonSyncDisabled = false;
                $scope.nodeSelected = function(e, data) {
                    var _l = data.node.li_attr;
                    dataTree = data;
                    var repos = _l.id.split("repos")[1];
                    var rfinal = repos.split("/");
                    $scope.owner = rfinal[1];
                    $scope.repo = rfinal[2];
                    $scope.getConfigurationlist(_l.id);
                    isLeaf = _l.isLeaf;
                    aceConfig.set("modePath", "libs/ace-builds/src-min/");
                    if (_l.isLeaf) {
                        FetchFileFactory.fetchFile(_l.base).then(function(data) {
                            var _d = data.data;
                            var previousContent = editor.getSession().getValue();
                            if (typeof _d == 'object') {
                                _d = JSON.stringify(_d, undefined, 2);
                            }
                            $scope.setEditorContent(_d, previousContent, filePath);
                            filePath = _l.id;
                            $scope.fileName = ': ' + filePath.split("/").pop(); //getting the selected node name
                            var mode = modelist.getModeForPath(filePath).mode;
                            editor.session.setMode(mode);
                            var type_file = _l.base.slice(-3);
                            if (type_file === "fbp") {
                                $scope.fbpType = true;
                                aceConfig.set("modePath", "js/ace/");
                                editor.getSession().setMode("ace/mode/fbp");
                            } else {
                                $scope.fbpType = false;
                            }

                            if ($scope.owner === "solettaproject") {
                                editor.setHighlightActiveLine(true);
                            } else {
                                editor.setHighlightActiveLine(false);
                                editor.setReadOnly(false);
                            }
                        });
                        $scope.root = false;
                    } else {
                        filePath = _l.id;
                        $scope.fileName = ': ' + filePath.split("/").pop(); //getting the selected node name
                        editor.setReadOnly(true);
                        editor.setHighlightActiveLine(false);
                        if (data.node.parent === "#") {
                            $scope.root = true;
                            $scope.setEditorContent('Please select a file to view its contents', null, null);
                        } else {
                            if (data.node.parents[1] === "#") {
                                $scope.root = true;
                                $scope.setEditorContent('Please select a file to view its contents', null, null);
                            } else {
                                if (!isLeaf) {
                                    $scope.setEditorContent('Please select a file to view its contents', null, null);
                                }
                                $scope.root = false;
                            }
                        }
                        $scope.fbpType = false;
                    }
                };

                function jsTreeTraverse(state, nodes) {
                    var inst = $('#jstree').jstree(true);
                    var node = inst.get_node(state);
                    var type = node.text.split(".").pop();
                    if (type === "json") {
                        nodes.push({id: node.id, text: node.text});
                    }
                    if (inst.is_parent(node)) {
                        $.each(node.children, function(index, child) {
                            jsTreeTraverse(child, nodes);
                        });
                    }
                }

                $scope.setEditorContent = function (content, previousContent, savePath) {
                    if ($scope.shouldSave === false || !previousContent) {
                        editor.getSession().setValue(content);
                    } else {
                        sure_dialog("Save", "The file was changed. Would you like to save it?",
                            function(close_id) {
                                if(close_id) {
                                    $scope.saveFile(savePath, previousContent);
                                    editor.getSession().setValue(content);
                                } else {
                                    editor.getSession().setValue(content);
                                }
                            });
                        $scope.shouldSave = false;
                    }
                };

                $scope.getConfigurationlist = function (repo_id) {
                    if ($scope.owner && $scope.repo) {
                        var id = "/";
                        var start_count = false;
                        var count = 0;
                        var array_repo = repo_id.split("/");
                        for (var i = 1; i < array_repo.length; i++) {
                            id = id + array_repo[i];
                            if (start_count) {
                                count++;
                                if(count === 2) {
                                    break;
                                }
                            }
                            id = id + "/";
                            if (array_repo[i] === "repos") {
                                start_count = true;
                            }
                        }

                        $('#configComboBox').empty();
                        $('#configComboBox').append('<option value="none">none</option>');
                        var nodes = [];
                        jsTreeTraverse($('#jstree').jstree(true).get_json(id), nodes);
                        if(nodes.length > 0) {
                            $('#configComboBox').combobox();
                            for (i = 0; i < nodes.length; i++) {
                                $("#configComboBox").append('<option value="'+ nodes[i].id +
                                                      '">'+ nodes[i].text + '</option>');
                            }
                        }
                    }
                };

                $("#configComboBox").combobox({
                    select: function( event, ui ) {
                      $scope.selectConfigPath = ui.item.value;
                      $scope.checkSyntaxStart();
                    }
                });

                $scope.openRunDialog = function() {
                    var dialog = $('<div></div>').html($compile('<table cellpadding="0" cellspacing="0" border="0"' +
                                                                'class="table table-hover data-table sort display"' +
                                                                'style="font-size: 12px !important; background-color:#262a2e;'+ 'color:#afb2b6;">'+
                                                                '<tbody><tr ng-repeat="item in RunViewer' +
                                                                "| orderBy:'__REALTIME_TIMESTAMP':true" + '" >' +
                                                                '<td class="time" style="width: 200px; border:0;"> ' +
                                                                "{{(item.__REALTIME_TIMESTAMP / 1000) | date:'dd-MM-yyyy HH:mm'}}</td>" +
                                                                '<td class="message" style="border:0;" >{{item.MESSAGE}}</td></tr></tbody></table>'
                                                               )($scope)).
                            dialog({
                                title: "Run",
                                autoOpen: false,
                                modal: true,
                                position: { at: "center top"},
                                height: 'auto',
                                width: '75%',
                                show: { effect: "fade", duration: 300 },
                                hide: {effect: "fade", duration: 300 },
                                resizable: 'disable',
                                scrollable: 'disable',
                                buttons: {
                                    Close: function() {
                                        $interval.cancel(promiseRunViewer);
                                        $(this).dialog("close");
                                    }
                                },
                                close: function(ev, ui){
                                    $interval.cancel(promiseRunViewer);
                                    $(this).dialog("close");
                                }
                            });
                    $scope.getOutput();
                    dialog.dialog("open");
                    promiseRunViewer = $interval(function () { $scope.getOutput(); }, $scope.runDialogRefreshPeriod);
                };

                $scope.getOutput = function () {
                    $http.get('/api/journald',
                    {
                        params: {
                            "unit_name": "fbp-runner@"
                        }
                    }).success(function(data) {
                        $scope.RunViewer = data;
                    }).error(function(){
                        $scope.RunViewer = "Erro getting systemd journald";
                    });
                };

                $scope.run = function() {
                    if ($scope.isServiceRunning) {
                        //Post stop service
                        $http.post('/api/fbp/stop').success(function(data) {
                            if (data == 1) {
                               alert("FBP Service failed to stop");
                            }
                        });
                    } else if ($scope.fbpType === true && $scope.buttonSyncDisabled === false) {
                        var fbpCode = editor.getSession().getValue();
                        var fbpName = $scope.fileName;
                        $scope.newFile = true;
                        var conf = $scope.selectConfigPath;
                        if (conf === "none") {
                            conf = null;
                        }
                        $http.post('/api/fbp/run',
                                {params: {
                                    "fbp_name": fbpName,
                                    "code": fbpCode,
                                    "conf": conf
                                }
                            }).success(function(data) {
                                if (data == 0) {
                                    $scope.openRunDialog();
                                } else {
                                    alert("FBP Failed to run");
                                }
                            }).error(function(){
                                $scope.openRunDialog();
                            });
                    }
                };

                $scope.newFbpFile = function() {
                    $scope.newFile = true;
                };

                $scope.$on('filePath', function () {
                    filePath = broadcastService.message;
                });

                $scope.applyCommit = function() {
                    var fbpCode = editor.getSession().getValue();
                    if (!fbpCode) {
                        alert("Failed to get FBP Code");
                    } else if (!$scope.username) {
                        alert("Must contain git username");
                    } else if (!$scope.password) {
                        alert("Must contain git password");
                    } else if (!$scope.repo) {
                        alert("Must contain target repository");
                    } else if (!$scope.branch) {
                        alert("Must contain branch name");
                    } else if (!$scope.owner) {
                        alert("Must contain repository owner");
                    } else if (!$scope.commitMsg) {
                        alert("Must contain a commit message");
                    } else if ($scope.owner === "solettaproject") {
                        alert("You can't commit on any repository that the owner is solettaproject");
                    } else {
                        var cachedPath = filePath.split($scope.repo + "/")[1];
                        if (!cachedPath) {
                            alert("Failed to parse file path");
                        } else {
                            var loading = $('<div></div>').
                                html($compile('<div us-spinner></div>')($scope)).
                                dialog({
                                    autoOpen: false,
                                    modal: true,
                                    dialogClass: 'no-close',
                                    position: { at: "center top"},
                                    height: 60,
                                    width: 50,
                                    show: { effect: "fade", duration: 300 },
                                    hide: {effect: "fade", duration: 300 },
                                    resizable: 'disable',
                                    buttons: {}
                                });
                            $('.no-close').find('.ui-dialog-titlebar').css('display','none');
                            $('.no-close').css('background','transparent');
                            $('.no-close').css('border','none');
                            loading.dialog("open");
                            $http.post('/api/git/repo/commit',{params: {
                                "user": $scope.username,
                                "password": $scope.password,
                                "repo":  $scope.repo,
                                "repo_owner": $scope.owner,
                                "new_file": false,
                                "branch": $scope.branch,
                                "content": fbpCode,
                                "commit_message": $scope.commitMsg,
                                "file_path": cachedPath}
                            }).success(function(data) {
                                alert("Commited!");
                                loading.dialog("close");
                                diag.dialog("close");
                            }).error(function(data){
                                alert("Error: " +  data);
                                loading.dialog("close");
                            });
                        }

                    }
                };

                $scope.commitDiag = function() {
                    diag = $('<div style="background-color:#2d3237"></div>').
                        html($compile('<div>Username:&nbsp;&nbsp;<input class="inputControls" style="width: 194px;" type="text" ng-model="username"/>' +
                                    '&nbsp;&nbsp;Password:&nbsp;<input class="inputControls" style="width: 190px;" type="password"'+
                                    'ng-model="password"/></div><br>' +
                                    'Repository:&nbsp;<input class="inputControls" style="width: 195px;" type="text" ng-model="repo"/>' +
                                    '&nbsp;&nbsp;Branch:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class="inputControls" style="width: 190px;" type="text"'+
                                    'ng-model="branch"/></div><br>' +
                                    '<br><div>Repository Owner:&nbsp;<input class="inputControls" type="text" style="width: 70%;"' +
                                    'ng-model="owner"/></div><br>' +
                                    '<div><div style="vertical-align:middle">Commit Message&nbsp;&nbsp;&nbsp;</div>' +
                                    '<div><textarea class="inputControls" style="height: 100px;" ng-model="commitMsg" rows="8" cols="59"/>' +
                                    '</div></div>')($scope)).
                        dialog({
                            title: "Git Commit",
                            autoOpen: false,
                            modal: true,
                            position: { at: "center top"},
                            height: 443,
                            width: 650,
                            show: { effect: "fade", duration: 300 },
                            hide: {effect: "fade", duration: 300 },
                            resize: 'disable',
                            buttons: {
                                "Submit":  $scope.applyCommit,
                        Cancel: function() {
                            $(this).dialog("close");
                        }
                            },
                            close: function(ev, ui){
                                $(this).dialog("close");
                            }
                        });
                    diag.dialog("open");
                };

                window.onbeforeunload = onBeforeUnload_Handler;
                function onBeforeUnload_Handler() {
                    if ($scope.isServiceRunning) {
                        $http.post('/api/fbp/stop').success(function(data) {
                            if (data == 1) {
                                alert("FBP Service failed to stop. Process should be stopped manually");
                            }
                        });
                    }

                    if ($scope.shouldSave === true) {
                        return "The file was changed and the data was not saved.";
                    } else {
                        return undefined;
                    }

                }

                $scope.checkSyntax = function () {
                    var fbpCode = editor.getSession().getValue();
                    if (fbpCode.trim().length > 1 && $scope.fbpType === true) {
                        var conf = $scope.selectConfigPath;
                        if (conf === "none") {
                            conf = null;
                        }
                        $http.get('/api/check/fbp',
                                {params: {
                                             "code": fbpCode,
                                             "conf": conf
                                         }
                                }).success(function(data) {
                                    $scope.FBPSyntax = data.trim();
                                    var errorline = data.match(/fbp_syntax\.fbp:[0-9]+:[0-9]+/g);
                                    var errorDesc = data.split(/fbp_syntax\.fbp:[0-9]+:[0-9]+/g);
                                    editor.getSession().removeMarker(markId);
                                    editor.getSession().clearAnnotations();
                                    if (errorline) {
                                        var lines = errorline[0].split(":");
                                        editor.getSession().setAnnotations([{
                                            row: lines[1]-1,
                                            column: lines[2]-1,
                                            text: errorDesc[1].trim(),
                                            type: "error"}]);
                                            var Range = ace.require("ace/range").Range;
                                            markId = editor.getSession().addMarker(
                                                                                  new Range(lines[1]-1, 0,
                                                                                  lines[1]-1, 144),
                                                                                  "errorHighlight",
                                                                                  "fullLine");
                                    } else {
                                        $http.get('/api/gen-svg',
                                            {params: {
                                                        "code": fbpCode
                                                     }
                                            }).success(function(data) {
                                            var themedSvg = data.replace("white", "#262a2e");
                                            $("#svgFrame").html(themedSvg);
                                        }).error(function(){
                                            console.log("Failed to generate SVG");
                                            $("#svgFrame").html("Failed to generate SVG");
                                        });
                                    }
                                }).error(function(){
                                    $scope.FBPSyntax = data.trim();
                                });
                    } else {
                        $scope.FBPSyntax = "";
                        editor.getSession().removeMarker(markId);
                        editor.getSession().clearAnnotations();
                    }
                    $scope.checkSyntaxStop();
                };

                $scope.checkSyntaxStop = function() {
                    $interval.cancel(promiseCheckSyntax);
                };

                $scope.checkSyntaxStart = function() {
                    $scope.checkSyntaxStop();
                    promiseCheckSyntax = $interval(
                            function () {
                                $scope.checkSyntax();
                            }, $scope.syntaxCheckRefreshPeriod);
                };

                $scope.saveFile = function(path, body) {
                    if (body && path && isLeaf) {
                        $http.get('api/file/write',
                                  {params: {
                                      "file_path": path,
                                      "file_body": body
                                      }
                                  });
                    }
                };

                $scope.saveFileManually = function() {
                      if ($scope.shouldSave) {
                          var file = filePath;
                          var body = editor.getSession().getValue();
                          if (file && body) {
                             $http.get('api/file/write',
                                  {params: {
                                      "file_path": file,
                                      "file_body": body
                                  }
                             }).success(function(data) {
                                $scope.shouldSave = false;
                                //pop * from the string
                                $scope.fileName = $scope.fileName.substring(0, $scope.fileName.length-1);
                             }).error(function(){
                                alert("Failed to save file on server. Try again.");
                                $scope.shouldSave = true;
                             });
                          } else {
                             alert("Something went terrbile wrong.\nFailed to save file on server. Try again.");
                          }
                      }
                  };

                editor.keyBinding.onCommandKey = function(e, hashId, keyCode) {
                    if ($scope.shouldSave === false && $scope.fileName) {
                        $scope.fileName = $scope.fileName + "*";
                        $scope.shouldSave = true;
                    }
                    this.origOnCommandKey(e, hashId, keyCode);
                };

                $scope.editorChanged = function (e) {
                    if (isRunningSyntax === false) {
                        isRunningSyntax = true;
                        $scope.checkSyntaxStart();
                        isRunningSyntax = false;
                    }
                };

                function sure_dialog(title, description, callback) {
                    var dialog = $('<div></div>').html(description).
                        dialog({
                            title: title,
                            autoOpen: false,
                            modal: true,
                            position: { at: "center top"},
                            height: 170,
                            width: 412,
                            resizable: 'disable',
                            show: { effect: "fade", duration: 300 },
                            hide: {effect: "fade", duration: 300 },
                            buttons: {
                                Yes: function() {
                                    $(this).dialog("close");
                                    callback(true);
                                },
                                No: function() {
                                    $(this).dialog("close");
                                    callback(false);
                                }
                            },
                            close: function(ev, ui){
                                callback(false);
                                $(this).dialog("close");
                            }
                        });
                    dialog.dialog("open");

                }

                $scope.newFolder = function () {
                    var file = filePath;
                    if (isLeaf) {
                        var cached = file.split("/");
                        cached.pop();
                        file = cached.join("/");
                    }
                    var dialog = $('<div></div>').
                                 html($compile('<input class="inputControls"' +
                                               ' type="text" style="width: 256px; outline: 0;"' +
                                               ' ng-model="folder_name" />')($scope)).
                    dialog({
                        title: "Choose the name of the new folder",
                        autoOpen: false,
                        modal: true,
                        position: { at: "center top"},
                        height: 167,
                        width: 300,
                        show: { effect: "fade", duration: 300 },
                        hide: {effect: "fade", duration: 300 },
                        resizable: 'disable',
                        buttons: {
                            "Apply": function() {
                                var name = "/" + $scope.folder_name;
                                if (name) {
                                    $http.post('/api/git/repo/create/folder',
                                    {
                                        params: {
                                            "folder_path": file + name
                                        }
                                    }).success(function(data) {
                                        $scope.refreshTree();
                                    }).error(function(){
                                        alert("Oh uh, something went wrong. Try again");
                                    });
                                } else {
                                    alert("Oh uh, something went wrong. Try again");
                                }
                                $(this).dialog("close");
                            },
                            Cancel: function() {
                                $(this).dialog("close");
                                }
                            },
                            close: function(ev, ui){
                                $(this).dialog("close");
                            }
                    });
                    dialog.dialog("open");
                };

                $scope.newFile = function () {
                    var file = filePath;
                    if (file) {
                        if (isLeaf) {
                            var cached = file.split("/");
                            cached.pop();
                            file = cached.join("/");
                        }
                        var dialog = $('<div></div>').
                                   html($compile('<input class="inputControls"' +
                                                 ' type="text" style="width: 256px; outline: 0;"' +
                                                 ' ng-model="file_name" />')($scope)).
                        dialog({
                          title: "Choose the name of the new file",
                          autoOpen: false,
                          modal: true,
                          position: { at: "center top"},
                          height: 167,
                          width: 300,
                          show: { effect: "fade", duration: 300 },
                          hide: {effect: "fade", duration: 300 },
                          resizable: 'disable',
                          buttons: {
                              "Apply": function() {
                                  var name = "/" + $scope.file_name;
                                  if (name) {
                                      $http.post('/api/git/repo/create/file',
                                      {
                                          params: {
                                              "file_path": file + name
                                          }
                                      }).success(function(data) {
                                          $scope.refreshTree();
                                      }).error(function(){
                                          alert("Oh uh, something went wrong. Try again");
                                      });
                                  } else {
                                      alert("Oh uh, something went wrong. Try again");
                                  }
                                  $(this).dialog("close");
                              },
                              Cancel: function() {
                                  $(this).dialog("close");
                                  }
                              },
                              close: function(ev, ui){
                                  $(this).dialog("close");
                              }
                      });
                      dialog.dialog("open");
                    } else {
                        console.log("Error: repository not selected");
                        alert("Folder destination must be selected!");
                    }
                };

                $scope.remove = function () {
                    if (filePath) {
                        var file_name = filePath.split("/").pop();
                        var repo = filePath.split("repos/")[1].split("/")[0];
                        if (repo !== "solettaproject") {
                            sure_dialog("Remove", "Are you sure you want to delete " + file_name + "?", function(close_id) {
                                if(close_id) {
                                    $http.post('/api/git/repo/delete/file',
                                        {params: {
                                                     "file_path": filePath
                                                 }
                                        }).success(function(data) {
                                            $scope.refreshTree();
                                        }).error(function(){
                                            alert("Oh uh, something went wrong. Try again");
                                        });
                                }
                            });
                        } else {
                            alert("You can't modify solettaproject repository");
                        }
                    } else {
                        alert("You have to select a file or folder before");
                    }

                };

                $scope.startServiceStatus = function () {
                    promiseServiceStatus = $interval(function () {
                        $interval.cancel(promiseServiceStatus);
                        $scope.getServiceStatus();
                    }, $scope.refreshPeriod);
                };

                $scope.getServiceStatus = function () {
                    $http.get('/api/service/status',
                            {params: {
                                         "service": "fbp-runner.service"
                                     }
                            }).success(function(data) {
                                $scope.startServiceStatus();
                                $scope.ServiceStatus = data.trim();
                                if ($scope.ServiceStatus.indexOf("active (running)") > -1) {
                                    $scope.isServiceRunning = true;
                                } else {
                                    $scope.isServiceRunning = false;
                                }
                                $scope.ServiceStatus = $scope.ServiceStatus.replace(/since.*;/,"");
                            }).error(function(){
                                $scope.startServiceStatus();
                                $scope.ServiceStatus = "Failed to get service information";
                            });
                };

                $scope.refreshTree = function () {
                    $('#jstree').jstree(true).refresh();
                    $scope.buttonSyncDisabled = false;
                };

                $scope.startSpin = function () {
                    usSpinnerService.spin('spinner-1');
                };

                $scope.stopSpin = function () {
                    usSpinnerService.stop('spinner-1');
                };

                $scope.syncGit = function() {
                    var repo = $scope.repoUrl;
                    $scope.buttonSyncDisabled = true;
                    $http.post('/api/git/repo/sync',{params: {
                        "repo_url": repo,
                    }}).success(function(data) {
                        $scope.refreshTree();
                        $scope.libChecked = true;
                        $scope.stopSpin();
                    }).error(function(data){
                        alert(data);
                        $scope.stopSpin();
                        $scope.buttonSyncDisabled = false;
                    });
                    $scope.startSpin();
                };

                $scope.processRunClass = function () {
                    if (!$scope.runConf) {
                        return "disable_div";
                    } else {
                        if ($scope.isServiceRunning) {
                            return "button_stop";
                        } else {
                            if ($scope.fbpType === true) {
                                return "button_run_on";
                            } else {
                                return "button_run_off";
                            }
                        }
                    }
                };

            $scope.processLoginClass = function () {
                    if (!$scope.loginConf) {
                        return "disable_div";
                    } else {
                        return "button_login_on";
                    }
                };
            }
    ]);
}());
