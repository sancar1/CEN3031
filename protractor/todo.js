describe('Testing Sign-in functionality', function() {
  
  beforeEach(function(){
	  ptor = protractor.getInstance();
  });
  
  it('sign in fail', function() {
    browser.get('http://localhost:3000/');

    element(by.model('credentials.username')).sendKeys('Admin');
    element(by.model('credentials.password')).sendKeys('0');
    element(by.css('[id="loginSubmitButton"]')).click();
	 browser.waitForAngular();
	 //Need to fix the check
	 var error = element.all(by.css('[data-ng-bind="error"]')).getText(0);
	 
	 expect(error).toEqual( [ 'Invalid password' ]);
	 browser.waitForAngular();
  });
  it('sign in pass',function(){ 
	  element(by.model('credentials.username')).clear();
	  element(by.model('credentials.password')).clear();
     element(by.model('credentials.username')).sendKeys('Admin');
     element(by.model('credentials.password')).sendKeys('123456789');
     element(by.css('[id="loginSubmitButton"]')).click();
	  browser.waitForAngular();
	  expect(ptor.getCurrentUrl()).toEqual('http://localhost:3000/#!/');
  });
});
describe('It should test the committee creation functionality', function() {
   beforeEach(function(){
 	  ptor = protractor.getInstance();
   });
	
  it('Should redirect to create page', function() {
	  element(by.css('[href="/#!/committees/create"]')).click();
	  	 browser.waitForAngular();
		expect(ptor.getCurrentUrl()).toEqual('http://localhost:3000/#!/committees/create');  
  });
  it('Should not allow creation without filling in information', function() {
	  element(by.css('[type="submit"]')).click();
	  	 browser.waitForAngular();
		expect(ptor.getCurrentUrl()).toEqual('http://localhost:3000/#!/committees/create');  
  });
  it('Should title committee and select admin as chair', function() {
	  element(by.model('committee.name')).sendKeys('Admin Protractor Test');
	  element(by.cssContainingText('option','Admin')).click();
 	  	 browser.waitForAngular();
		 element(by.css('[type="submit"]')).click();
		 browser.waitForAngular();
		 expect(ptor.getCurrentUrl()).toContain('#!/committees/');
  });
  
});
