var expect = require('expect.js');

describe('Index Page', function(){
    it('should contain a heading', function() {
        browser.ignoreSynchronization = true;
        // Get Index
        browser.get('/');
        // Test loaded CSS
        element(by.css('.menu-item'));
        element(by.css('.blueLabel'));
        element.all(by.css('.menu-item')).first().getText().then(function(text) {
            expect(text).to.be('EDITOR');
        });
        browser.ignoreSynchronization = false;
    });
});
