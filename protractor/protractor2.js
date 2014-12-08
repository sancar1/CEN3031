describe('Testing Sign-in functionality', function() {
  
  beforeEach(function(){
	  ptor = protractor.getInstance();
  });
 it('sign in pass',function(){ 
	  browser.get('http://localhost:3000/');
     element(by.model('credentials.username')).sendKeys('Protractor2');
     element(by.model('credentials.password')).sendKeys('123456789');
     element(by.css('[id="loginSubmitButton"]')).click();
	  browser.waitForAngular();
	  expect(ptor.getCurrentUrl()).toEqual('http://localhost:3000/#!/');
  });
  it('Should click on the committee it is a member of',function(){
  	element.all(by.css('[data-ng-bind="committee.name"]')).then(function(arr){
  		expect(arr.length).toBe(1);
		browser.waitForAngular();
		arr[0].click();
  	});
	browser.waitForAngular();
	expect(ptor.getCurrentUrl()).toContain('/committees');
  });
  it('Should not see edit tab',function(){
  	expect(element(by.css('[ng-if="committeeTemplates.edit"]')).isPresent()).toBe(false);
  });
	it('Should log out for next set of tests',function(){
  	  element(by.css('[data-ng-bind="authentication.user.displayName"]')).click();
  	  element(by.css('[href="/auth/signout"]')).click();
 		expect(ptor.getCurrentUrl()).toEqual('http://localhost:3000/#!/prelogin');
});
});
