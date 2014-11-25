'use strict';

(function() {
	// Agendaitems Controller Spec
	describe('Agendaitems Controller Tests', function() {
		// Initialize global variables
		var AgendaitemsController,
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

			// Initialize the Agendaitems controller.
			AgendaitemsController = $controller('AgendaitemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Agendaitem object fetched from XHR', inject(function(Agendaitems) {
			// Create sample Agendaitem using the Agendaitems service
			var sampleAgendaitem = new Agendaitems({
				name: 'New Agendaitem'
			});

			// Create a sample Agendaitems array that includes the new Agendaitem
			var sampleAgendaitems = [sampleAgendaitem];

			// Set GET response
			$httpBackend.expectGET('agendaitems').respond(sampleAgendaitems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.agendaitems).toEqualData(sampleAgendaitems);
		}));

		it('$scope.findOne() should create an array with one Agendaitem object fetched from XHR using a agendaitemId URL parameter', inject(function(Agendaitems) {
			// Define a sample Agendaitem object
			var sampleAgendaitem = new Agendaitems({
				name: 'New Agendaitem'
			});

			// Set the URL parameter
			$stateParams.agendaitemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/agendaitems\/([0-9a-fA-F]{24})$/).respond(sampleAgendaitem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.agendaitem).toEqualData(sampleAgendaitem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Agendaitems) {
			// Create a sample Agendaitem object
			var sampleAgendaitemPostData = new Agendaitems({
				name: 'New Agendaitem'
			});

			// Create a sample Agendaitem response
			var sampleAgendaitemResponse = new Agendaitems({
				_id: '525cf20451979dea2c000001',
				name: 'New Agendaitem'
			});

			// Fixture mock form input values
			scope.name = 'New Agendaitem';

			// Set POST response
			$httpBackend.expectPOST('agendaitems', sampleAgendaitemPostData).respond(sampleAgendaitemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Agendaitem was created
			expect($location.path()).toBe('/agendaitems/' + sampleAgendaitemResponse._id);
		}));

		it('$scope.update() should update a valid Agendaitem', inject(function(Agendaitems) {
			// Define a sample Agendaitem put data
			var sampleAgendaitemPutData = new Agendaitems({
				_id: '525cf20451979dea2c000001',
				name: 'New Agendaitem'
			});

			// Mock Agendaitem in scope
			scope.agendaitem = sampleAgendaitemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/agendaitems\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/agendaitems/' + sampleAgendaitemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid agendaitemId and remove the Agendaitem from the scope', inject(function(Agendaitems) {
			// Create new Agendaitem object
			var sampleAgendaitem = new Agendaitems({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Agendaitems array and include the Agendaitem
			scope.agendaitems = [sampleAgendaitem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/agendaitems\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAgendaitem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.agendaitems.length).toBe(0);
		}));
	});
}());