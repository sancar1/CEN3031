'use strict';

// Meetings controller
angular.module('meetings').controller('MeetingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Meetings',
	function($scope, $stateParams, $location, Authentication, Meetings ) {
		$scope.authentication = Authentication;
		// Create new Meeting
		$scope.create = function() {
			// Create new Meeting object



			var meeting = new Meetings.Meetings({
				name: this.meeting.name,
				noteTaker: this.noteTaker.id,
				startTime: new Date(2014,11,23),
				endTime: new Date(2014,11,25),
				allDay: false,
				scheduleById: $scope.committee.schedule

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
$scope.find = function(){
	Meetings.List.query({
			committeeId: $stateParams.committeeId
		}).$promise.then(function(data) {
				$scope.meetings = data;
				console.log($scope.meetings);
				// $log.info('List of Meetings Loaded');
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
		$scope.getNotetaker = function() {
			var userById = $scope.meeting.noteTaker;
			console.log('userId: '+userById);
			//console.log('beforecall');
			//console.log($scope.meeting);
			Meetings.NoteTaker.get({meetingId: $scope.meeting._id, userId: userById, committeeId: $stateParams.committeeId}).$promise.then(function(data){
				//console.log('inside');
				//console.log(data);
				$scope.noteTaker = data;
			});
		};

		// Update existing Meeting
		$scope.setNotetaker = function(user) {
			var meeting = $scope.meeting ;

			Meetings.Notetaker.update({meetingId: meeting._id, noteTakerId: user._id}).$promise.then(function(data){
				// console.log(data);
				$scope.meeting = data;
			});
		};

		// Update existing Meeting
		$scope.removeNotetaker = function(user) {
			var meeting = $scope.meeting ;

			Meetings.Notetaker.delete({meetingId: meeting._id, noteTakerId: user._id}).$promise.then(function(data){
				// console.log(data);
				$scope.meeting = data;
			});
				
		};

		// Find existing Meeting
		$scope.findOne = function() {
			console.log('in findOne for meeting');
			Meetings.Meeting.get({ 
				meetingId: $stateParams.meetingId,
				committeeId: $stateParams.committeeId
			}).$promise.then(function(data) {
				$scope.meeting = data;
				console.log('data: '+data);
				// $log.debug('$scope.committee: ');
				// $log.debug($scope.committee);

				$scope.getNotetaker();
			//	$scope.getMembers();	
			});
		};
	//Start of Date Picker Code
	
	
	$scope.today = function() {
	    $scope.dt = new Date();
	  };
	  $scope.today();

	  $scope.clear = function () {
	    $scope.dt = null;
	  };

	  // Disable weekend selection
	  // $scope.disabled = function(date, mode) {
 // 	    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
 // 	  };

	  $scope.toggleMin = function() {
	    $scope.minDate = $scope.minDate ? null : new Date();
	  };
	  $scope.toggleMin();

	  $scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	  };

	  $scope.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	  };

	  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  $scope.format = $scope.formats[3];
		
		
	//End of Date Picker Code	
	//Start Time Picker Code
	
   $scope.myStartTime = new Date();
 	$scope.myEndTime = new Date();
    $scope.hstep = 1;
    $scope.mstep = 15;

    // $scope.options = {
//       hstep: [1, 2, 3],
//       mstep: [1, 5, 10, 15, 25, 30]
//     };

    $scope.ismeridian = true;
    // $scope.toggleMode = function() {
//       $scope.ismeridian = ! $scope.ismeridian;
//     };

    $scope.update = function() {
      var d = new Date();
      d.setHours( 14 );
      d.setMinutes( 0 );
      $scope.mytime = d;
    };

    $scope.changed = function () {
      console.log('Time changed to: ' + $scope.mytime);
    };

    $scope.clear = function() {
      $scope.mytime = null;
    };
  //End Time Picker Code
	
	
	
	}
]);