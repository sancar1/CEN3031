(function() {
	// Committees Controller Spec
	describe('Committees Controller Tests', function() {
		// Initialize global variables
		var UsersController,
			CommitteesController,
			userScope,
			committeeScope,
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

		it('$scope.find() should create an array with at least one Committee object fetched from XHR', inject(function(Committees) {
			// Create sample Committee using the Committees service
			var sampleCommittee = new Committees({
				name: 'New Committee'
			});

			// Create a sample Committees array that includes the new Committee
			var sampleCommittees = [sampleCommittee];

			// Set GET response
			$httpBackend.expectGET('committees').respond(sampleCommittees);

			// Run controller functionality
			committeeScope.find();
			$httpBackend.flush();

			// Test scope value
			expect(committeeScope.committees).toEqualData(sampleCommittees);
		}));

		it('$scope.findOne() should create an array with one Committee object fetched from XHR using a committeeId URL parameter', inject(function(Committees) {
			// Define a sample Committee object
			var sampleCommittee = new Committees({
				name: 'New Committee'
			});

			// Set the URL parameter
			$stateParams.committeeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/committees\/([0-9a-fA-F]{24})$/).respond(sampleCommittee);

			// Run controller functionality
			committeeScope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(committeeScope.committee).toEqualData(sampleCommittee);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Committees) {
			// Create a sample Committee object
			var sampleCommitteePostData = new Committees({
				name: 'New Committee'
			});

			// Create a sample Committee response
			var sampleCommitteeResponse = new Committees({
				_id: '525cf20451979dea2c000001',
				name: 'New Committee'
			});

			// Fixture mock form input values
			committeeScope.name = 'New Committee';

			// Set POST response
			$httpBackend.expectPOST('committees', sampleCommitteePostData).respond(sampleCommitteeResponse);

			// Run controller functionality
			committeeScope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(committeeScope.name).toEqual('');

			// Test URL redirection after the Committee was created
			expect($location.path()).toBe('/committees/' + sampleCommitteeResponse._id);
		}));

		it('$scope.update() should update a valid Committee', inject(function(Committees) {
			// Define a sample Committee put data
			var sampleCommitteePutData = new Committees({
				_id: '525cf20451979dea2c000001',
				name: 'New Committee'
			});

			// Mock Committee in scope
			committeeScope.committee = sampleCommitteePutData;

			// Set PUT response
			$httpBackend.expectPUT(/committees\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			committeeScope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/committees/' + sampleCommitteePutData._id);
		}));

		it('$scope.addMember() should update a valid Committee', inject(function(Committees) {
			// Define a sample Committee put data
			var sampleCommitteePutData = new Committees({
				_id: '525cf20451979dea2c000001',
				name: 'New Committee'
			});

			// Mock Committee in scope
			committeeScope.committee = sampleCommitteePutData;

			// Set PUT response
			$httpBackend.expectPUT(/committees\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			committeeScope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/committees/' + sampleCommitteePutData._id);
		}));


		it('$scope.removeMember() should update a valid Committee', inject(function(Committees) {
			// Define a sample Committee put data
			var sampleCommitteePutData = new Committees({
				_id: '525cf20451979dea2c000001',
				name: 'New Committee'
			});

			// Mock Committee in scope
			committeeScope.committee = sampleCommitteePutData;

			// Set PUT response
			$httpBackend.expectPUT(/committees\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			committeeScope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/committees/' + sampleCommitteePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid committeeId and remove the Committee from the scope', inject(function(Committees) {
			// Create new Committee object
			var sampleCommittee = new Committees({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Committees array and include the Committee
			committeeScope.committees = [sampleCommittee];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/committees\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			committeeScope.remove(sampleCommittee);
			$httpBackend.flush();

			// Test array after successful delete
			expect(committeeScope.committees.length).toBe(0);
		}));

		it('$scope.checkAdmin() should return true if user is an Admin', inject(function(Committees, Users) {
			// Create new Committee object
			var sampleCommittee = new Committees({
				_id: '525a8422f6d0f87f0e407a33',
			});
			var sampleUser = new Committees({
				userName: 'userName',
				role: 'Admin'
			});
			committeeScope.currentUser = sampleUser;

			// Run controller functionality
			committeeScope.checkAdmin();

			// Test array after successful delete
			expect(committeeScope.checkAdmin()).toBe(true);
		}));
		it('$scope.checkAdmin() should return false if user is not an Admin', inject(function(Committees, Users) {
			// Create new Committee object
			var sampleCommittee = new Committees({
				_id: '525a8422f6d0f87f0e407a33',
			});
			var sampleUser = new Committees({
				userName: 'userName',
				role: 'Student'
			});
			committeeScope.currentUser = sampleUser;

			// Run controller functionality
			committeeScope.checkAdmin();

			// Test array after successful delete
			expect(committeeScope.checkAdmin()).toBe(false);
		}));
		it('$scope.checkLoggedIn() should return true if user is logged in', inject(function(Committees, Users) {
			// Create new Committee object
			var sampleCommittee = new Committees({
				_id: '525a8422f6d0f87f0e407a33',
			});
			var sampleUser = new Committees({
				userName: 'userName',
				role: 'Student'
			});
			committeeScope.currentUser = sampleUser;

			// Run controller functionality
			committeeScope.checkLoggedIn();

			// Test array after successful delete
			expect(committeeScope.checkLoggedIn()).toBe(true);
		}));
		it('$scope.checkLoggedIn() should return false if nobody is logged in', inject(function(Committees, Users) {
			// Create new Committee object
			var sampleCommittee = new Committees({
				_id: '525a8422f6d0f87f0e407a33',
			});
			var sampleUser = new Committees({
				userName: 'userName',
				role: 'Student'
			});
			committeeScope.currentUser = null;

			// Run controller functionality
			committeeScope.checkLoggedIn();

			// Test array after successful delete
			expect(committeeScope.checkLoggedIn()).toBe(false);
		}));
		it('$scope.userInCommittee() should return true if the user is in the committee', inject(function(Committees, Users) {
			// Create new Committee object
			var sampleUser = new Users({
				userName: 'userName'
			});
			sampleUser._id = '123456789';
			committeeScope.currentUser = sampleUser;
			var sampleCommittee = new Committees({
				name : 'testCommitte',
				currentUser : sampleUser._id,
				members: [sampleUser]
			});

			// Run controller functionality
			committeeScope.userInCommittee(sampleCommittee);

			// Test array after successful delete
			expect(committeeScope.userInCommittee(sampleCommittee)).toBe(true);
		}));
		it('$scope.userInCommittee() should return false if the user is not the committee', inject(function(Committees, Users) {
			// Create new Committee object
			var sampleUser = new Users({
				userName: 'userName'
			});
			sampleUser._id = '123456789';
			committeeScope.currentUser = sampleUser;
			var sampleCommittee = new Committees({
				name : 'testCommitte',
				currentUser : '12345678987654321',
				members: ['123456789']
			});

			// Run controller functionality
			committeeScope.userInCommittee(sampleCommittee);

			// Test array after successful delete
			expect(committeeScope.userInCommittee(sampleCommittee)).toBe(false);
		}));
		
	});
}());