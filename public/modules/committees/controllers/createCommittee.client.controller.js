'use strict';

// Committees controller
angular.module('committees').controller('CreateCommitteeCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Users', 'Committees', '$q', '$log', 'Schedules',
	function($scope, $stateParams, $location, Authentication, Users, Committees, $q, $log, Schedules) {

		/* Committee Functions */
		$scope.addSchedule = function(schedule, committee){
			var committeeById = committee._id;
			var scheduleById = schedule._id;
			committee.schedule = scheduleById;
			committee.$update(function() {
				// empty method
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Create new Schedule
		$scope.createSchedule = function(committee) {

			// Create new Schedule object
			var schedule = new Schedules.Schedules({
				name: committee.name + ' Schedule'
			});
			$scope.schedule =schedule;

			// Redirect after save
			schedule.$save(function(response) {
				
				$scope.addSchedule(schedule, committee);

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

		};

		// Create new Committee
		$scope.createCommittee = function() {
			// Create new Committee object

			$log.debug('Entered create function');

			var committee = new Committees.Committees({
				name: this.committee.name,
				chair: this.chair.id,
				members:[this.chair.id]
			});

			// Redirect after save
			committee.$save(function(response) {

				$scope.createSchedule(response);
				$location.path('committees/' + response._id);
		
				// Clear form fields
				// this.committee.name = '';
				// this.chair.id = '';

			}, function(errorResponse) { 
				$scope.error = errorResponse.data.message;
			});

			//Clear form fields
			this.committee.name = '';
			this.chair.id = '';

		};

	}
]);