(function() {
	// Authentication controller Spec
	describe('UsersController', function() {
		// Initialize global variables
		var UsersController,
			CommitteesController,
			userScope,
			committeeScope,
			$httpBackend,
			$stateParams,
			$location;

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

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			userScope = $rootScope.$new();
			committeeScope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Committees controller.
			UsersController = $controller('UsersController', {
				$scope: userScope
			});
			CommitteesController = $controller('CommitteesController', {
				$scope: committeeScope
			});
		}));

		it('$scope.find() should create an array with at least one User object fetched from XHR', inject(function(Users) {
			// Create sample Committee using the Committees service
			var sampleUser = new Users({
				userName: 'userName'
			});

			// Create a sample Committees array that includes the new Committee
			var sampleUsers = [sampleUser];

			// Set GET response
			$httpBackend.expectGET('users').respond(sampleUsers);

			// Run controller functionality
			userScope.find();
			$httpBackend.flush();

			// Test scope value
			expect(userScope.users).toEqualData(sampleUsers);
		}));

		it('$scope.inCommittee() should return false if no members in the committee', inject(function(Users, Committees){
			// Define a sample Committee object
			var sampleUser = new Users({
				userName: 'userName'
			});
			var sampleCommittee = new Committees({
				name : 'testCommitte'
			});

			userScope.inCommittee(sampleUser);

			// Test scope value
			expect(userScope.inCommittee(sampleUser)).toEqualData(false);
		}));
	});
}());