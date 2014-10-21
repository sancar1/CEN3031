'use strict';

// Attendances controller
angular.module('attendances').controller('AttendancesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Attendances',
	function($scope, $stateParams, $location, Authentication, Attendances ) {
		$scope.authentication = Authentication;

		// Create new Attendance
		$scope.create = function() {
			// Create new Attendance object
			var attendance = new Attendances.Attendances ({
			
			});

			// Redirect after save
			attendance.$save(function(response) {
				$location.path('attendances/' + response._id);

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Attendance
		$scope.remove = function( attendance ) {
			if ( attendance ) { attendance.$remove();

				for (var i in $scope.attendances ) {
					if ($scope.attendances [i] === attendance ) {
						$scope.attendances.splice(i, 1);
					}
				}
			} else {
				$scope.attendance.$remove(function() {
					$location.path('attendances');
				});
			}
		};

		// Update existing Attendance
		$scope.update = function() {
			var attendance = $scope.attendance ;

			attendance.$update(function() {
				$location.path('attendances/' + attendance._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.getAttendees = function(){
			var attendence = $scope.attendance;

			Attendances.Attendees.query({attendanceId: $stateParams.attendanceId}).$promise.then(function(data) {
				// $log.debug(data);
				$scope.attendees = data;
			});
		};


		// Find a list of Attendances
		$scope.find = function() {
			$scope.attendances = Attendances.Attendances.query();
		};

		// Find existing Attendance
		$scope.findOne = function() {
			$scope.attendance = Attendances.Attendances.get({ 
				attendanceId: $stateParams.attendanceId
			});
		};
	}
]);