// This file is part of the Soletta Project
//
// Copyright (C) 2016 Intel Corporation. All rights reserved.
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
    var nodes = require('./nodetypes/nodetypes.js');
    
    var dirpath = path.join(__dirname, '../client/js/ace/snippets');
    checkFolder(dirpath);
    var file_path = path.join(dirpath, 'fbp.js');

    this.generateNodetypes = function() {
        try {
            var content = nodes.getNodeTypesName();
            var final = 'define(\"ace/snippets/fbp\",[\"require\"' +
                        ',\"exports\",\"module\"],function(e,t,n)' +
                        '{\"use strict\";t.snippetText=\"';

            generateSnippets(content, final);
        } catch (err) {
            console.log(err);
        }
    };
    
    var generateSnippets = function(content, final) {
        var strings = generateStrings(content);
        var contlen = content.length;
        for (var i = 0; i < contlen; i++) {
            final = final + 'trigger ' + strings.triggers.pop() + 
            '\\n' + 'snippet ' + strings.names.pop() + '\\n\\t' +
            content.pop() + '\\n';
        }
        final = final + '\",t.scope=\"fbp\"})';
        fs.writeFile(file_path, final, function(err) {
            if (err) {
                console.log(err);
            }
        });
    };

    var generateStrings = function(content) {
        var names = [];
        var triggers = [];
        var x = "";
        for (var i = 0; i < content.length; i++) {
            var temp = content[i].split('/');
            for (var j = 0; j < temp.length; j++) {
                x = x + dash(temp[j].split('-'));
            }
            temp[0] = temp[0].toUpperCase();
            if (temp[1]) {
                temp[1] = temp[1].charAt(0).toUpperCase() + temp[1].slice(1);
                names.push(temp[0] + ' ' + temp[1]);
            } else {
                names.push(temp[0]);
            }
            triggers.push(x);
            x = "";
        }
        return {
            names: names,
            triggers: triggers
        };
    };

    var dash = function(arr) {
        var y = "";
        for (var k = 0; k < arr.length; k++) {
            y = y + arr[k].slice(0,4);
        }
        return y;
    };

    function checkFolder(dirpath) {
        try {
            fs.statSync(dirpath);
        } catch(err) {
            fs.mkdirSync(dirpath);
        }
    };
};