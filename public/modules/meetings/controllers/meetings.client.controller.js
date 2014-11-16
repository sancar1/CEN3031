'use strict';

// Meetings controller
angular.module('meetings').controller('MeetingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Meetings', '$log',
	function($scope, $stateParams, $location, Authentication, Meetings, $log) {
		$scope.authentication = Authentication;
		$scope.dateTime = new Date();

		console.log('$stateParams.committeeId');
		console.log($stateParams.committeeId);

		// Find a list of Meetings
		Meetings.Meetings.query({
			committeeId: $stateParams.committeeId
		}).$promise.then(function(data) {
			$scope.meetings = data;
			$log.info('List of Meetings Loaded');
		});

		// Create new Meeting
		$scope.create = function() {
			// Create new Meeting object
			var meeting = new Meetings.Meetings ({
				name: this.meeting.name,
				noteTaker: this.noteTaker.id,
				startTime: $scope.dateTime,
				endTime: new Date(2014,10,25),
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
			var meetingById = $scope.meeting._id;
			//console.log('beforecall');
			//console.log($scope.meeting);
			Meetings.NoteTaker.get({meetingId: meetingById}).$promise.then(function(data){
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
			Meetings.Meetings.get({ 
				meetingId: $stateParams.meetingId
			}).$promise.then(function(data) {
				$scope.meeting = data;
				
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
		console.log('Date d = ' + $scope.dt.getDay());
		$scope.dateTime = new Date($scope.dt.getFullYear(),$scope.dt.getMonth(),$scope.dt.getDate(),$scope.mytime.getHours(),$scope.mytime.getMinutes())
		console.log('Object Date= ' + $scope.dateTime);
    };

    $scope.clear = function() {
      $scope.mytime = null;
    };
  //End Time Picker Code
	
	
	
	}
]);