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
    app.factory('FetchFileFactory', ['$http',
        function($http) {
            var _factory = {};
            _factory.fetchFile = function(file) {
                return $http.get('/api/resource?resource=' + encodeURIComponent(file));
            };
            return _factory;
    }]);

    app.factory('broadcastService', function($rootScope) {
        var sharedService = {};
        sharedService.message = {};
        sharedService.eventName = '';
        sharedService.prepForBroadcast = function(evName, msg) {
            this.message = msg;
            this.eventName = evName;
            this.broadcastItem();
        };
        sharedService.broadcastItem = function() {
            $rootScope.$broadcast(this.eventName);
        };
        return sharedService;
    });

    app.factory('svConf', ['$http', function($http) {
            var _factory = {};
            _factory.fetchConf = function () {
                return $http.get('/api/configuration');
            };
        return _factory;
    }]);

}());
