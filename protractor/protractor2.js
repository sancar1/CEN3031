describe('Testing Sign-in functionality', function() {
  
  beforeEach(function(){
	  ptor = protractor.getInstance();
  });
 it('sign in pass',function(){ 
	 browser.get('http://localhost:3000/');
	  element(by.model('credentials.username')).clear();
	  element(by.model('credentials.password')).clear();
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
  it('Should sign-out when finished',function(){
	  element(by.xpath(' /html/body/header/div/ul[2]/li/a/span')).click();
	  element(by.xpath('/html/body/header/div/ul[2]/li/ul/li[5]/a')).click();
	  browser.waitForAngular();
  });
});
