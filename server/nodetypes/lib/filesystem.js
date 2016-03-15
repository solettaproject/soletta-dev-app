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

    this.getNodeFiles = function (path, files_) {
        files_ = files_ || [];
        var files = fs.readdirSync(path);
        for (var i in files) {
            var name = path + '/' + files[i];
            if (fs.statSync(name).isDirectory()) {
                getFiles(name, files_);
            } else {
                files_.push(name);
            }
        }
        return files_;
    };

    this.getJSONFromFile = function (jsonFile) {
        var file = fs.readFileSync(jsonFile, 'utf8');
        try {
            return JSON.parse(file);
        } catch (err) {
            console.log(err);
        }
    };
};

