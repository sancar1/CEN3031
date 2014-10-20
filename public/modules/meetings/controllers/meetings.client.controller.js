'use strict';

// Meetings controller
angular.module('meetings').controller('MeetingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Meetings',
	function($scope, $stateParams, $location, Authentication, Meetings ) {
		$scope.authentication = Authentication;

		// Create new Meeting
		$scope.create = function() {
			// Create new Meeting object
			var meeting = new Meetings.Meetings ({
				name: this.name
			});

			// Redirect after save
			meeting.$save(function(response) {
				$location.path('meetings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Meeting
		$scope.remove = function( meeting ) {
			if ( meeting ) { meeting.$remove();

				for (var i in $scope.meetings ) {
					if ($scope.meetings [i] === meeting ) {
						$scope.meetings.splice(i, 1);
					}
				}
			} else {
				$scope.meeting.$remove(function() {
					$location.path('meetings');
				});
			}
		};

		// Update existing Meeting
		$scope.update = function() {
			var meeting = $scope.meeting ;

			meeting.$update(function() {
				$location.path('meetings/' + meeting._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Update existing Meeting
		$scope.getNotetaker = function(user) {
			var meeting = $scope.meeting ;

			Meetings.Notetaker.get({meetingId: meeting._id, noteTakerId: user._id}).$promise.then(function(data){
				console.log(data);
				$scope.noteTaker = data;
			});
		};

		// Update existing Meeting
		$scope.setNotetaker = function(user) {
			var meeting = $scope.meeting ;

			Meetings.Notetaker.update({meetingId: meeting._id, noteTakerId: user._id}).$promise.then(function(data){
				console.log(data);
				$scope.meeting = data;
			});
		};

		// Update existing Meeting
		$scope.removeNotetaker = function(user) {
			var meeting = $scope.meeting ;

			Meetings.Notetaker.delete({meetingId: meeting._id, noteTakerId: user._id}).$promise.then(function(data){
				console.log(data);
				$scope.meeting = data;
			});
				
		};

		// Find a list of Meetings
		$scope.find = function() {
			$scope.meetings = Meetings.Meetings.query();
		};

		// Find existing Meeting
		$scope.findOne = function() {
			$scope.meeting = Meetings.Meetings.get({ 
				meetingId: $stateParams.meetingId
			});
		};
	}
]);