'use strict';

(function() {
	// Meetings Controller Spec
	describe('Meetings Controller Tests', function() {
		// Initialize global variables
		var MeetingsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Meetings controller.
			MeetingsController = $controller('MeetingsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Meeting object fetched from XHR', inject(function(Meetings) {
			// Create sample Meeting using the Meetings service
			var sampleMeeting = new Meetings({
				name: 'New Meeting'
			});

			// Create a sample Meetings array that includes the new Meeting
			var sampleMeetings = [sampleMeeting];

			// Set GET response
			$httpBackend.expectGET('meetings').respond(sampleMeetings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.meetings).toEqualData(sampleMeetings);
		}));

		it('$scope.findOne() should create an array with one Meeting object fetched from XHR using a meetingId URL parameter', inject(function(Meetings) {
			// Define a sample Meeting object
			var sampleMeeting = new Meetings({
				name: 'New Meeting'
			});

			// Set the URL parameter
			$stateParams.meetingId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/meetings\/([0-9a-fA-F]{24})$/).respond(sampleMeeting);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.meeting).toEqualData(sampleMeeting);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Meetings) {
			// Create a sample Meeting object
			var sampleMeetingPostData = new Meetings({
				name: 'New Meeting'
			});

			// Create a sample Meeting response
			var sampleMeetingResponse = new Meetings({
				_id: '525cf20451979dea2c000001',
				name: 'New Meeting'
			});

			// Fixture mock form input values
			scope.name = 'New Meeting';

			// Set POST response
			$httpBackend.expectPOST('meetings', sampleMeetingPostData).respond(sampleMeetingResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Meeting was created
			expect($location.path()).toBe('/meetings/' + sampleMeetingResponse._id);
		}));

		it('$scope.update() should update a valid Meeting', inject(function(Meetings) {
			// Define a sample Meeting put data
			var sampleMeetingPutData = new Meetings({
				_id: '525cf20451979dea2c000001',
				name: 'New Meeting'
			});

			// Mock Meeting in scope
			scope.meeting = sampleMeetingPutData;

			// Set PUT response
			$httpBackend.expectPUT(/meetings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/meetings/' + sampleMeetingPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid meetingId and remove the Meeting from the scope', inject(function(Meetings) {
			// Create new Meeting object
			var sampleMeeting = new Meetings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Meetings array and include the Meeting
			scope.meetings = [sampleMeeting];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/meetings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMeeting);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.meetings.length).toBe(0);
		}));
	});
}());