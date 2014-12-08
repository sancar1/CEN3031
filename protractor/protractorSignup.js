describe('Testing Sign-in functionality', function() {
  
  beforeEach(function(){
	  ptor = protractor.getInstance();
  });
 it('sign up click',function(){ 
	 browser.get('http://localhost:3000/');
	  element(by.css('[ui-route="/signup"]')).click()
	  browser.waitForAngular();
	  expect(ptor.getCurrentUrl()).toEqual('http://localhost:3000/#!/signup');
  });
  it('Should try to submit with nothing and get error',function(){
	 //Tests password and errors related
	 expect(element(by.css('[data-ng-bind="error"]')).isDisplayed()).toBe(false);
	 element(by.buttonText('Sign up')).click();
	 browser.waitForAngular();
	 expect(element(by.css('[data-ng-bind="error"]')).getText()).toBe('Password should be longer');
	 element(by.model('credentials.password')).sendKeys('1');
	 element(by.buttonText('Sign up')).click();
	 expect(element(by.css('[data-ng-bind="error"]')).getText()).toBe('Please fill in your email');
  	 //Tests a incorrect format for email, proper email, and associated errors
	 element(by.model('credentials.email')).sendKeys('a');
  	 element(by.buttonText('Sign up')).click();
 	 expect(element(by.css('[data-ng-bind="error"]')).getText()).toBe('Please fill in your email');
 	 element(by.model('credentials.email')).clear();
 	 element(by.model('credentials.email')).sendKeys('a@a');
 	 element(by.buttonText('Sign up')).click();
	 expect(element(by.css('[data-ng-bind="error"]')).getText()).toBe('Please fill in your last name');
  	 //Tests last name and error
	 element(by.model('credentials.lastName')).sendKeys('Test');
 	 element(by.buttonText('Sign up')).click();
	 expect(element(by.css('[data-ng-bind="error"]')).getText()).toBe('Please fill in your first name');
  	 //Tests first name and error
	 element(by.model('credentials.firstName')).sendKeys('Signup');
 	 element(by.buttonText('Sign up')).click();
	 //Password minimum length
	 expect(element(by.css('[data-ng-bind="error"]')).getText()).toBe('Password should be longer');
	 //Enters proper length password
	 element(by.model('credentials.password')).clear();
	 element(by.model('credentials.password')).sendKeys('123456789');
	 element(by.buttonText('Sign up')).click();
	 //Proper email address warning
	 expect(element(by.css('[data-ng-bind="error"]')).getText()).toBe('Please fill a valid email address');
	 //Fix email
 	 element(by.model('credentials.email')).sendKeys('bc.com');
 	 element(by.buttonText('Sign up')).click();
	 expect(element(by.css('[data-ng-bind="error"]')).getText()).toBe('Please fill in a username');
  });
});
describe('Testing Sign-in functionality', function() {
it('Should test forgotten password',function(){
	browser.get('http://localhost:3000/#!/password/forgot');
	element(by.buttonText('Submit')).click();
	expect(element(by.css('[data-ng-show="error"]')).getText()).toBe('Username field must not be blank');
	
});


});
