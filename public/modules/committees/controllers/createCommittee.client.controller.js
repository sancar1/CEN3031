'use strict';

// Committees controller
angular.module('committees').controller('CreateCommitteeCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Users', 'Committees', '$q', '$log', 'Schedules',
	function($scope, $stateParams, $location, Authentication, Users, Committees, $q, $log, Schedules) {

		/* Committee Functions */
		$scope.addSchedule = function(schedule){
			$log.debug('Entered addSchedule');
			var committee = $scope.committee;
			var scheduleById = schedule._id;
			console.log('schedule id: '+scheduleById);
			console.log('committee id: '+committee._id);
			$scope.committee.schedule = scheduleById;
			$scope.committee.$update(function() {
				// $location.path('committees/' + committee._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Create new Schedule
		$scope.createSchedule = function() {
			$log.debug('Entered createSchedule');

			// Create new Schedule object
			var schedule = new Schedules.Schedules({
				name: $scope.committee.name + ' Schedule'
			});
			$scope.schedule =schedule;

			$log.debug('Before save function in createSchedule');
			// Redirect after save
			schedule.$save(function(response) {
				//$location.path('schedules/' + response._id);

				// Clear form fields
                console.log('schedule id: '+schedule._id);
                console.log('committee id: '+$scope.committee._id);
               // $scope.addSchedule(schedule);
              
               $scope.addSchedule(schedule);

				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

      		$log.debug('Schedule was created');

		};

		// Create new Committee
		$scope.createCommittee = function() {
			// Create new Committee object

			$log.debug('Entered create function');

			var committee = new Committees.Committees({
				name: this.committee.name,
				chair: this.chair.id
			});

			$log.debug('Committee Resource Object');
			$log.debug(committee);
			
			console.log('Before save committee');

			// Redirect after save
			committee.$save(function(response) {
				$log.debug('Entered save committee function');

				$location.path('committees/' + response._id);
		
				// Clear form fields
				this.committee.name = '';
				this.chair.id = '';
			}, function(errorResponse) { 
				$scope.error = errorResponse.data.message;
			});

			// committee.$save(function() {
			// 	$log.debug('OPEN SESAME!!!!!!');
			// });

			console.log('After save committee');

			$scope.createSchedule();

			//Clear form fields
			this.committee.name = '';
			this.chair.id = '';

		};

		// $scope.testfunc();

	}
]);