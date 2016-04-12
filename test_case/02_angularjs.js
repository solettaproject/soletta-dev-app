var expect = require('expect.js');

describe('Index Page', function(){
    it('should be able to get angularjs scopped variable', function() {
        // Get Index
        browser.get('/');
        browser.waitForAngular(); //Wait angularjs to load
        /*
         * This function will test if a ng-model searchText is NULL.
         * This variable is scopped by angularjs and it is loaded null by default.
         * If this scopped var is not found then we got an error on angularjs and the
         * test will fail
        */
        element(by.model('searchText')).evaluate('searchText').then(function(value) {
            if (!value) {
                return true;
            } else {
                return false;
            }
        });
    });
});
