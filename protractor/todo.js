function selectOption(element, item, milliseconds) {
    var desiredOption;
    element.findElements(by.tagName('option'))
    .then(function findMatchingOption(options) {
        options.some(function (option) {
            option.getText().then(function doesOptionMatch(text) {
                if (text.indexOf(item) != -1) {
                    desiredOption = option;
                    return true;
                }
            });
        });
    })
    .then(function clickOption() {
        if (desiredOption) {
            desiredOption.click();
        }
    });
    if (typeof milliseconds != 'undefined') {
        browser.sleep(milliseconds);
    }
};


describe('Testing Sign-in functionality', function() {
  
  beforeEach(function(){
	  ptor = protractor.getInstance();
  });
  
  it('sign in fail', function() {
    browser.get('http://localhost:3000/');

    element(by.model('credentials.username')).sendKeys('Protractor1');
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
     element(by.model('credentials.username')).sendKeys('Protractor1');
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
	  element(by.model('committee.name')).sendKeys('Protractor Test');
	  element(by.cssContainingText('option','Protractor Test 1')).click();
 	  	 browser.waitForAngular();
		 element(by.css('[type="submit"]')).click();
		 browser.waitForAngular();
		 expect(ptor.getCurrentUrl()).toContain('#!/committees/');
  });
  it('Should show page for newly created committee', function(){
  	element.all(by.css('[data-ng-bind="member.displayName"]')).then(function(arr){
		expect(arr[0].getText()).toBe('Protractor Test 1');});
	var chair  = element(by.css('[data-ng-bind="chair.displayName"]')).getText(0);
	
	expect(chair).toEqual('Protractor Test 1');	
  });
});

describe('It should test the committee edit functionality', function() {
it('Should load up the edit page', function(){
	browser.waitForAngular();
	element(by.css('[ng-if="committeeTemplates.edit"]')).click();
	browser.waitForAngular();
	element(by.id('description')).sendKeys('Test Protractor Description');
	browser.waitForAngular();
	element(by.css('[type="submit"]')).click();
	browser.waitForAngular();
	browser.refresh();
	expect(element(by.model('committee.description')).getAttribute('value')).toEqual('Test Protractor Description');
});

it('Should have pre-populated the member list with the chair',function(){
	browser.waitForAngular();
	element.all(by.css('[data-ng-bind="member.displayName"]')).then(function(arr){
		expect(arr[0].getText()).toBe('Protractor Test 1');});
});
it('Should select protractor 2 to add as a member',function(){
	element(by.id('addMember')).click();
	element(by.xpath("//*[contains(text(),'Protractor Test 2')]")).click();
	browser.waitForAngular();
	browser.refresh();
	element.all(by.css('[data-ng-bind="member.displayName"]')).then(function(arr){
		expect(arr[1].getText()).toBe('Protractor Test 2');
	});
});
it('Should select protractor 2 to remove as a member',function(){
	element(by.id('deleteMember')).click();

	element(by.xpath("/html/body/div/div/div[2]/div/section/section[1]/div[2]/form/section/div[2]/ul/li/a[2]/span")).click();
	browser.waitForAngular();
	browser.refresh();
	
	element.all(by.css('[data-ng-bind="member.displayName"]')).then(function(arr){
		expect(arr[1].getText()).toBe('');
	});
});

it('Should delete the committee',function(){

	element(by.css('[ng-click="deleteCommittee()"]')).click();
	browser.waitForAngular();
});
});