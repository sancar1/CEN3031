
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

// it('Should have pre-populated the member list with the chair',function(){
// 	browser.waitForAngular();
// 	element.all(by.css('[data-ng-bind="member.displayName"]')).then(function(arr){
// 		expect(arr[0].getText()).toBe('Protractor Test 1');});
// });
// it('Should select protractor 2 to add as a member',function(){
// 	element(by.id('addMember')).click();
// 	element(by.xpath("//*[contains(text(),'Protractor Test 2')]")).click();
// 	browser.waitForAngular();
// 	browser.refresh();
// 	element.all(by.css('[data-ng-bind="member.displayName"]')).then(function(arr){
// 		expect(arr[1].getText()).toBe('Protractor Test 2');
// 	});
// });
// it('Should select protractor 2 to remove as a member',function(){
// 	element(by.id('deleteMember')).click();
//
// 	element(by.xpath("/html/body/div/div/div[2]/div/section/section[1]/div[2]/form/section/div[2]/ul/li/a[2]/span")).click();
// 	browser.waitForAngular();
// 	browser.refresh();
//
// 	element.all(by.css('[data-ng-bind="member.displayName"]')).then(function(arr){
// 		expect(arr[1].getText()).toBe('');
// 	});
// });
it('Should re-add protractor 2 and move to meetings page',function(){
	element(by.id('addMember')).click();
	element(by.xpath("//*[contains(text(),'Protractor Test 2')]")).click();
	browser.waitForAngular();
	browser.refresh();
	element.all(by.css('[data-ng-bind="member.displayName"]')).then(function(arr){
		expect(arr[1].getText()).toBe('Protractor Test 2');
	element(by.css('[ng-if="committeeTemplates.meetings"]')).click();
			browser.waitForAngular();
			expect(ptor.getCurrentUrl()).toContain('/meetings');
	});
	});
});

//Tests for Meetings Page
describe('It should test the Meetings functionality', function() {
it('Should show create button for admin', function(){
	expect(element(by.id('createMeeting')).isDisplayed()).toBe(true);
});
it('Should click on Create Meeting and redirect',function(){
	element(by.id('createMeeting')).click();
	expect(ptor.getCurrentUrl()).toContain('/meetings/create');	
});
it('Should not allow to create if name not typed',function(){
	element(by.cssContainingText('option','Protractor Test 1')).click();
	element(by.css('[type="submit"]')).click();
	browser.waitForAngular();
	element.all(by.css('[data-ng-bind="error"]')).then(function(arr){
		expect(arr[0].getText()).toBe('Please fill meeting name');
	});
});
it('Should open the date picker popup',function(){
	expect(element(by.css('[class="btn btn-sm btn-info ng-binding"]')).isDisplayed()).toBe(false);
	ptor.sleep(1000);
	element(by.css('[class="glyphicon glyphicon-calendar"]')).click();
	browser.waitForAngular();
	expect(element(by.css('[class="btn btn-sm btn-info ng-binding"]')).isDisplayed()).toBe(true);
	ptor.actions().sendKeys(protractor.Key.ESCAPE).perform();
	browser.waitForAngular();
	expect(element(by.css('[class="btn btn-sm btn-info ng-binding"]')).isDisplayed()).toBe(false);
});
it('Should create a proper meeting and redirect',function(){
	element(by.model('myStartTime')).element(by.model('hours')).clear();
	element(by.model('myStartTime')).element(by.model('hours')).sendKeys('10');
	element(by.model('myStartTime')).element(by.model('minutes')).clear();
	element(by.model('myStartTime')).element(by.model('minutes')).sendKeys('30');
	element(by.model('myEndTime')).element(by.model('hours')).clear();
	element(by.model('myEndTime')).element(by.model('hours')).sendKeys('11');
	element(by.model('myEndTime')).element(by.model('minutes')).clear();
	element(by.model('myEndTime')).element(by.model('minutes')).sendKeys('30');
});
it('Should let the user use the arrows to change the time',function(){
	//Start Hours
	element(by.model('myStartTime')).element(by.css('[ng-click="incrementHours()"]')).click();
	expect(element(by.model('myStartTime')).element(by.model('hours')).getAttribute('value')).toBe('11');
	element(by.model('myStartTime')).element(by.css('[ng-click="decrementHours()"]')).click();
	expect(element(by.model('myStartTime')).element(by.model('hours')).getAttribute('value')).toBe('10');
	//Start Minutes
	element(by.model('myStartTime')).element(by.css('[ng-click="incrementMinutes()"]')).click();
	expect(element(by.model('myStartTime')).element(by.model('minutes')).getAttribute('value')).toBe('45');
	element(by.model('myStartTime')).element(by.css('[ng-click="decrementMinutes()"]')).click();
	expect(element(by.model('myStartTime')).element(by.model('minutes')).getAttribute('value')).toBe('30');
	//End Hours
	element(by.model('myEndTime')).element(by.css('[ng-click="incrementHours()"]')).click();
	expect(element(by.model('myEndTime')).element(by.model('hours')).getAttribute('value')).toBe('12');
	element(by.model('myEndTime')).element(by.css('[ng-click="decrementHours()"]')).click();
	expect(element(by.model('myEndTime')).element(by.model('hours')).getAttribute('value')).toBe('11');
	//End Minutes
	element(by.model('myEndTime')).element(by.css('[ng-click="incrementMinutes()"]')).click();
	expect(element(by.model('myEndTime')).element(by.model('minutes')).getAttribute('value')).toBe('45');
	element(by.model('myEndTime')).element(by.css('[ng-click="decrementMinutes()"]')).click();
	expect(element(by.model('myEndTime')).element(by.model('minutes')).getAttribute('value')).toBe('30');
});
it('Should click submit and then redirect',function(){
	element(by.model('meeting.name')).sendKeys('Protractor Meeting 1');
	element(by.css('[type="submit"]')).click();
	browser.waitForAngular();
	expect(ptor.getCurrentUrl()).toContain('/meetings/');	
});
it('Should pre-populate the meetings page with the information created on the create page',function(){
	expect(element(by.css('[data-ng-bind="meeting.name"]')).getText()).toBe('Protractor Meeting 1');
	expect(element(by.css('[data-ng-bind="noteTaker.displayName"]')).getText()).toBe('Protractor Test 1');
	expect(element(by.css('[data-ng-bind="meeting.members.length"]')).getText()).toBe('2');
	expect(element(by.css('[data-ng-bind="meeting.membersPresent"]')).getText()).toBe('0');
});
it('Should click a check-box and update the members present number',function(){
	element(by.xpath('/html/body/div/div/div[2]/div/section/section/section/div[4]/div[1]/div[1]/div[2]/div[2]/label/span')).click();
	browser.waitForAngular();
	expect(element(by.css('[data-ng-bind="meeting.membersPresent"]')).getText()).toBe('1');
});
it('Should update the notes portion for the meeting',function(){
	expect(element(by.css('[data-ng-model="meeting.notes"]')).isDisplayed()).toBe(true);
	element(by.css('[data-ng-model="meeting.notes"]')).sendKeys('Test Meeting Notes');
	browser.waitForAngular();
});
// it('Should delete the committee',function(){
// 	element(by.css('[ng-if="committeeTemplates.edit"]')).click();
// 			browser.waitForAngular();
// 	element(by.css('[ng-click="deleteCommittee()"]')).click();
// 	browser.waitForAngular();
// });
});