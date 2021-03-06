'use strict';

// Meetings controller
angular.module('meetings').controller('MeetingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Meetings', '$log', '$timeout', '$state',
	function($scope, $stateParams, $location, Authentication, Meetings, $log, $timeout, $state) {
		$scope.authentication = Authentication;
		$scope.StartDateTime = new Date();
		$scope.EndDateTime = new Date();

		// Find existing Meeting
		console.log('Finding meeting');
		Meetings.Meeting.get({ 
			meetingId: $stateParams.meetingId,
			committeeId: $stateParams.committeeId
		}).$promise.then(function(data) {
			$scope.meeting = data;
			console.log('data: '+data);
			$scope.getNotetaker();
			$scope.agendaItemInMeeting();
			$scope.getAgendas();
		});

		// Create new Meeting
		$scope.create = function() {
			// Create new Meeting object
			var temp = [];
			console.log($scope.members);
			for(var i = 0; i < $scope.members.length; i++){
				var tempObj = {
					displayName : $scope.members[i].displayName,
					userId : $scope.members[i]._id,
					isPresent : false
				};

				temp.push(tempObj);
			}

			console.log($scope.committee.members);
			var meeting = new Meetings.Meetings({
				committeeId: $stateParams.committeeId,
				name: this.meeting.name,
				noteTaker: this.noteTaker.id,
				members: temp,
				membersPresent: 0,
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

		$scope.getAgendas = function(){
			var meeting = $scope.meeting;
			$scope.currentItems = [];
			console.log('here'+meeting.agendaitems);
			for(var i = 0; i < meeting.agendaitems.length; i++){
				for(var k = 0; k < $scope.agendaitems.length; k++){
					console.log(meeting.agendaitems[i]);
					console.log($scope.agendaitems[k]._id);
					if(meeting.agendaitems[i]=== $scope.agendaitems[k]._id){
						$scope.currentItems[i] = $scope.agendaitems[k];
						console.log('i: '+$scope.currentItems[i]);
					}	
						
				}
			}
		};

		// Update existing Meeting
		$scope.updateMeeting = function() {
			var meeting = $scope.meeting;
			meeting.committeeId = $scope.committee._id;
			console.log(meeting);
			meeting.$update(function() {
				$location.path('committees/' + $stateParams.committeeId + '/meetings/' + meeting._id);
				$state.reload();
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

		// // Find existing Meeting
		// $scope.findOne = function() {
		// 	console.log('in findOne for meeting');
		// 	Meetings.Meeting.get({ 
		// 		meetingId: $stateParams.meetingId,
		// 		committeeId: $stateParams.committeeId
		// 	}).$promise.then(function(data) {
		// 		$scope.meeting = data;
		// 		console.log('data: '+data);
		// 		// $log.debug('$scope.committee: ');
		// 		// $log.debug($scope.committee);

		// 		$scope.getNotetaker();

		// 		// if((typeof $scope.meeting.membersPresent) === 'undefined')
  //   //     			$scope.meeting.membersPresent = 0;

		// 	});
		// };
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
        	console.log('Current Meeting Object:');
        	console.log($scope.meeting);
        	var now = new Date();

        	var currentTime = {
        		'hour' : now.getHours(),
        		'minutes' : now.getMinutes(),
        		'seconds' : now.getSeconds()
        	};

        	console.log(now.getHours());

        	if(now.getHours() > 11) {
        		currentTime.period = 'pm';
            }
        	else
        		currentTime.period = 'am';

        	if(now.getHours() > 12)
        		currentTime.hour = currentTime.hour - 12;

        	if(now.getMinutes() < 10)
        		currentTime.minutes = '0' + currentTime.minutes;

        	// $scope.saveMessage = 'Attendance last saved at ' + currentTime.hour + ':' + currentTime.minutes + currentTime.period;

			meeting.$update(function() {
                $scope.saveMessage = 'Attendance last saved at ' + currentTime.hour + ':' + currentTime.minutes + currentTime.period;
				// $scope.saveMessage = 'Attendance Saved Successfully';
				// $timeout(function() {
				// 	$scope.saveMessage = '';
				// }, 3000);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        };

        $scope.agendaItemInMeeting = function() {
        	console.log('here in agenda');
        	for(var i = 0; i < $scope.agendaitems.length; i++){
        		for(var j = 0; j < $scope.meeting.agendaitems.length; j++){
	        		if($scope.meeting.agendaitems[j] === $scope.agendaitems[i]._id)
	        			$scope.agendaitems[i].inMeeting = true;
	        		//else $scope.agendaitems[i].inMeeting = false;
	        	}
        	}
        };

        $scope.saveAgendaItems = function() {
        	console.log('meeting object NOW!');
        	console.log($scope.meeting);
        	var meeting = $scope.meeting ;
        	console.log($scope.agendaitems.length);
        	for(var i = 0; i < $scope.agendaitems.length; i++){
        		var index = -1;
				for(var j = 0; j < meeting.agendaitems.length; j++){
					if($scope.agendaitems[i]._id === meeting.agendaitems[j]){
						index = j;
					}
				}

				if($scope.agendaitems[i].inMeeting && index === -1) {
					console.log('inside inMeeting');
					meeting.agendaitems.push($scope.agendaitems[i]);
				}
				else if(index !== -1 && !$scope.agendaitems[i].inMeeting) {
					var length = meeting.agendaitems.length;
					meeting.agendaitems.splice(index, 1);
					console.log(meeting.agendaitems);
				}


			}

			console.log('agenda items to be saved');
			console.log(meeting.agendaitems);

        	// $scope.saveMessage = 'Attendance last saved at ' + currentTime.hour + ':' + currentTime.minutes + currentTime.period;

			meeting.$update(function() {
				console.log('in update meeting');
                // $scope.saveMessage = 'Attendance last saved at ' + currentTime.hour + ':' + currentTime.minutes + currentTime.period;
				// $scope.saveMessage = 'Attendance Saved Successfully';
				// $timeout(function() {
				// 	$scope.saveMessage = '';
				// }, 3000);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        };
	// }

	}
]);