'use strict';

// Meetings controller
angular.module('meetings').controller('MeetingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Meetings', '$log', '$timeout',
	function($scope, $stateParams, $location, Authentication, Meetings, $log, $timeout) {
		$scope.authentication = Authentication;
		$scope.StartDateTime = new Date();
		$scope.EndDateTime = new Date();

		// Create new Meeting
		$scope.create = function() {
			// Create new Meeting object
			var meeting = new Meetings.Meetings({
				name: this.meeting.name,
				noteTaker: this.noteTaker.id,
				startTime: $scope.StartDateTime,
				endTime: $scope.EndDateTime,
				allDay: false,
				scheduleById: $scope.committee.schedule

			});

			// Redirect after save
			meeting.$save(function(response) {
				$location.path('committees/' + $stateParams.committeeId + '/meetings/' + response._id);

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
		$scope.updateMeeting = function() {
			console.log('here to update');
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

				if((typeof $scope.meeting.membersPresent) === 'undefined')
        			$scope.meeting.membersPresent = 0;

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

    // $scope.update = function() {
 //      var d = new Date();
 //      d.setHours( 14 );
 //      d.setMinutes( 0 );
 //      $scope.myStartTime = d;
 //    };
 
//Why is it -5?
    $scope.changed = function () {
		$scope.StartDateTime = new Date($scope.dt.getFullYear(),$scope.dt.getMonth(),$scope.dt.getDate(),$scope.myStartTime.getHours()-5,$scope.myStartTime.getMinutes());
		$scope.EndDateTime = new Date($scope.dt.getFullYear(),$scope.dt.getMonth(),$scope.dt.getDate(),$scope.myEndTime.getHours()-5,$scope.myEndTime.getMinutes());
		console.log('Start Hour= ' + $scope.StartDateTime.getHours());
		console.log('End Hour= ' + $scope.EndDateTime.getHours());
    };

    $scope.clear = function() {
      $scope.myStartTime = null;
    };
  //End Time Picker Code

    	/* Attendance Checking */
        $scope.checkMembersPresent = function(isPresent){
            // $log.debug('Committee Members:');
            // $log.debug($scope.members);

            // $log.debug('isPresent:');
            // $log.debug(isPresent);

            if(isPresent === true){
                $scope.meeting.membersPresent++;
            }

            if(isPresent === false){
                $scope.meeting.membersPresent--;
            }
        };

        $scope.saveAttendance = function() {
        	var meeting = $scope.meeting ;
        	var now = new Date();

        	var currentTime = {
        		'hour' : (now.getHours() % 11).toString(),
        		'minutes' : (now.getMinutes()).toString(),
        		'seconds' : (now.getSeconds()).toString()
        	};

        	if(now.getHours() > 11)
        		currentTime.period = 'pm';
        	else
        		currentTime.period = 'am';

        	if(now.getMinutes() < 10)
        		currentTime.minutes = '0' + currentTime.minutes;

        	$scope.saveMessage = 'Attendance last saved at ' + currentTime.hour + ':' + currentTime.minutes + currentTime.period;

			// meeting.$update(function() {
				// $scope.saveMessage = 'Attendance Saved Successfully';
				// $timeout(function() {
				// 	$scope.saveMessage = '';
				// }, 3000);
			// }, function(errorResponse) {
			// 	$scope.error = errorResponse.data.message;
			// });
        };
	// }

	}
]);