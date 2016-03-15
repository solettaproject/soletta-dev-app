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

require ('./lib/init.js')();
require ('./lib/filesystem.js')();

// Default nodeTypes json files
var nodeTypesPath = "/usr/share/soletta/flow/descriptions";

var functions = {

   /**
    * Set the path where soletta-nodetypes has to get the nodetypes json files
    *
    * @param path: string
    *
    * @return BOOLEAN: true - Path is setted
    *                  false - Something went wrong
    */
    setNodeTypesPath: function (path) {
        try {
            if (isPathExist(path)) {
                nodeTypesPath = path;
                return true;
            } else {
                console.log("ERR soletta-nodetypes: Failed to set path as " + path);
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    },

   /**
    * Get the current path of the nodetypes json files
    *
    * @return string
    */
    getNodeTypesPath: function() {
        return nodeTypesPath;
    },

   /**
    *  Get full Soletta modules as JSON with all fields
    *
    *  @return JSON
    */
    getModules: function () {
        var nodeTypes = [];
        var files = getNodeFiles(nodeTypesPath);
        for (var i in files) {
            var json = getJSONFromFile(files[i]);
            nodeTypes.push(json);
        }
        return nodeTypes;
    },

   /**
    * Get the name of all modules
    *
    * @return ARRAY_OF_STRING
    */
    getModulesName: function () {
        var modules = [];
        var files = getNodeFiles(nodeTypesPath);
        for (var i in files) {
            var json = getJSONFromFile(files[i]);
            json = Object.keys(json).shift();
            modules.push(json);
        }
        return modules;
    },

   /**
    * Get the node types as JSON with all fields
    *
    * @return JSON
    */
    getNodeTypes: function () {
        var nodeTypes = [];
        var files = getNodeFiles(nodeTypesPath);
        for (var i in files) {
            var json = getJSONFromFile(files[i]);
            var key = Object.keys(json).shift();
            var node = json[key];
            nodeTypes.push(node);
        }
        return nodeTypes;
    },

   /**
    * Get the name of all node types.
    *
    * @return ARRAY_OF_STRING
    */
    getNodeTypesName: function () {
        var nodeTypesName = [];
        var files = getNodeFiles(nodeTypesPath);
        for (var i in files) {
            var json = getJSONFromFile(files[i]);
            var key = Object.keys(json).shift();
            var nodes = json[key];
            for (var j in nodes) {
                nodeTypesName.push(nodes[j].name);
            }
        }
        return nodeTypesName;
    }
};

try {
    init(nodeTypesPath);
    module.exports = functions;
} catch (err) {
    console.log(err);
}
