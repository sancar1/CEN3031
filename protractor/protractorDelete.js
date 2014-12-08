describe('Testing the delete modal and clearing all the data created by protractor', function() {
  
  beforeEach(function(){
	  ptor = protractor.getInstance();
  });
 it('sign in pass',function(){ 
	 browser.get('http://localhost:3000/#!/prelogin');
	  
     element(by.model('credentials.username')).sendKeys('Protractor1');
     element(by.model('credentials.password')).sendKeys('123456789');
     element(by.css('[id="loginSubmitButton"]')).click();
	  browser.waitForAngular();
	  expect(ptor.getCurrentUrl()).toEqual('http://localhost:3000/#!/');
  });
  it('Should test the delete modal',function(){
    	element.all(by.css('[data-ng-bind="committee.name"]')).then(function(arr){
  		browser.waitForAngular();
  		arr[0].click();
    	})
		element(by.css('[ng-if="committeeTemplates.edit"]')).click();
  		expect(element(by.id('modal')).isPresent()).toBe(false);
  		element(by.buttonText('Delete Committee!')).click();
  		expect(element(by.id('modal')).isPresent()).toBe(true);
  		element(by.buttonText('Cancel')).click();
  		expect(element(by.id('modal')).isPresent()).toBe(false);
  		element(by.buttonText('Delete Committee!')).click();
  		element(by.buttonText('Delete!')).click();
  		expect(ptor.getCurrentUrl()).toEqual('http://localhost:3000/#!/');
  	});
});
