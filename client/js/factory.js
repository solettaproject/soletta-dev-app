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
