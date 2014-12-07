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

    element(by.model('credentials.username')).sendKeys('Protractor');
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
     element(by.model('credentials.username')).sendKeys('Protractor');
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
	  element(by.model('committee.name')).sendKeys('Protractor Test New');
	  element(by.cssContainingText('option','Protractor')).click();
 	  	 browser.waitForAngular();
		 element(by.css('[type="submit"]')).click();
		 browser.waitForAngular();
		 expect(ptor.getCurrentUrl()).toContain('#!/committees/');
  });
  it('Should show page for newly created committee', function(){
  	var member = element(by.css('[data-ng-bind="member.displayName"]')).getText(0);
	var chair  = element(by.css('[data-ng-bind="chair.displayName"]')).getText(0);
	expect(member).toEqual('Protractor Test');
	expect(chair).toEqual('Protractor Test');	
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
	ptor.sleep(2000);
	browser.waitForAngular();
	expect(element(by.model('committee.description')).getText()).toEqual('Test Protractor Description');
});

it('Should have pre-populated the member list with the chair',function(){
	browser.waitForAngular();
	expect(element(by.css('[data-ng-bind="member.displayName"]')).getText(0)).toBe('Protractor Test');
});
it('Should select protractor 2 to add as a member',function(){
	element(by.id('addMember')).click();
	ptor.sleep(2000);
	element(by.xpath("//*[contains(text(),'Protractor Test 2')]")).click();
	browser.waitForAngular();
	browser.refresh();
	element.all(by.css('[data-ng-bind="member.displayName"]')).then(function(arr){
		expect(arr[1].getText()).toBe('Protractor Test 2');
	});
	//expect(element.all(by.css('[data-ng-bind="member.displayName"]')).getText()).toBe('Protractor Test 2');
});


it('Should delete the committee',function(){

	element(by.css('[ng-click="deleteCommittee()"]')).click();
	browser.waitForAngular();
});
});