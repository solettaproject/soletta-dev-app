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
    app.controller ('SystemdJournald', ['$scope', '$http', '$interval', '$location', 'svConf',
        function ($scope, $http, $interval, $location, svConf) {

           var promiseJournal;
           $scope.journalRefreshPeriod = 3000;

           svConf.fetchConf().success(function(data){
                var journal = data.journal_access;
                $scope.journalRefreshPeriod= parseInt(data.journal_refresh_period);
                if (journal === false) {
                    $(".systemd-journald").remove();
                } else {
                    $scope.startJournal();
                }
            });

            $scope.run = function() {
                $scope.stopJournal();
                $http.get('/api/journald').success(function(data) {
                    $scope.JournaldViewer = data;
                    $scope.startJournal();
                }).error(function(){
                    $scope.startJournal();
                    $scope.JournaldViewer = "Erro getting systemd journald";
                });
            };

            $scope.startJournal = function() {
                promiseJournal = $interval(function () {
                    $scope.run();
                }, $scope.journalRefreshPeriod);
            };

            $scope.stopJournal = function() {
                $interval.cancel(promiseJournal);
            };

        }]);
}());

