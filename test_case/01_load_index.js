var expect = require('expect.js');

describe('Index Page', function(){
    it('should contain a heading', function() {
        browser.ignoreSynchronization = true;
        // Get Index
        browser.get('/');
        // Test loaded CSS
        element(by.css('.menu-item'));
        element(by.css('.blueLabel'));
        element.all(by.css('.page-title')).first().getText().then(function(text) {
            expect(text).to.be('Editor');
        });
        browser.ignoreSynchronization = false;
    });
});
