describe('It should sign-in', function() {
  it('sign in fail', function() {
    browser.get('http://localhost:3000/');

    element(by.model('credentials.username')).sendKeys('Admin');
    element(by.model('credentials.password')).sendKeys('0');
    element(by.css('[class="btn btn-lg btn-primary btn-block"]')).click();
	 browser.waitForAngular();
	 //Need to fix the check
	 var error = element.all(by.css('[data-ng-bind="error"]'));
	 expect(error.getText());
	 browser.waitForAngular();
  });
  it('sign in pass',function(){ 
	  element(by.model('credentials.username')).clear();
	  element(by.model('credentials.password')).clear();
     element(by.model('credentials.username')).sendKeys('Admin');
     element(by.model('credentials.password')).sendKeys('123456789');
     element(by.css('[class="btn btn-lg btn-primary btn-block"]')).click();
	  browser.waitForAngular();
  });
});