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
