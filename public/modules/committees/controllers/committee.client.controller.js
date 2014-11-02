'use strict';

// Committees controller
angular.module('committees').controller('CommitteeCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Users', 'Committees', '$q', '$log',
	function($scope, $stateParams, $location, Authentication, Users, Committees, $q, $log) {
		
		/* Committee Link Permissions */
		if($scope.role.admin)
			$scope.committeeTemplates.edit = true;

		$scope.committeeTemplates.attendance = true;
		$scope.committeeTemplates.schedule = true;
		$scope.committeeTemplates.resources = true;

		/* Committee Data to be Loaded on Page Load */
		$scope.findCommittee().then(function() {
			$scope.getChair();
			$scope.getMembers();
		});

		/* Committee Functions */
		// Create new Committee
		$scope.create = function($scope) {
			// Create new Committee object
			var committee = new Committees.Committees ({
				name: this.committee.name,
				chair: this.chair.id
			});
			
			// Redirect after save
			committee.$save(function(response) {
				$location.path('committees/' + response._id);
		
				// Clear form fields
				this.committee.name = null;
				this.chair.id = null;
			}, function(errorResponse) { 
				$scope.error = errorResponse.data.message;
			});

			//Clear form fields
			this.committee.name = null;
			this.chair.id = null;

		};

		// Remove existing Committee
		$scope.remove = function( committee ) {
			if ( committee ) { committee.$remove();

				for (var i in $scope.committees ) {
					if ($scope.committees [i] === committee ) {
						$scope.committees.splice(i, 1);
					}
				}
			} else {
				$scope.committee.$remove(function() {
					$location.path('committees');
				});
			}
		};

		// Update existing Committee
		$scope.update = function() {
			var committee = $scope.committee ;

			committee.$update(function() {
				$location.path('committees/' + committee._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//Add member to committee
		$scope.addMember = function(user){
			var committee = $scope.committee;
			var passed = 1;		
			angular.forEach(committee.members, function(members){
				if(members === user._id) passed = 0;
			});
			if(passed){
				Committees.Member.update({userId: user._id,committeeId: committee._id},function(){
					$location.path('committees/' + committee._id+'/edit');
				});
			}
		};

		$scope.removeMember = function(member){
			var committee = $scope.committee;
			var passed = 0;		
			angular.forEach(committee.members, function(members){
				if(members === member._id) passed = 1;
			});
			if(passed) Committees.Member.remove({userId: member._id,committeeId: committee._id},function(){
					$location.path('committees/' + committee._id+'/edit');
			});
		};

		$scope.getMembers = function(){
			var committee = $scope.committee;
			var Members = Committees.Members.query({committeeId: committee._id}).$promise.then(function(data) {
				// $log.debug(data);
				$scope.members = data;
			});
		};

		$scope.getMeetings = function(){
			var committee = $scope.committee;
			var Meetings = Committees.Meetings.query({committeeId: committee._id}).$promise.then(function(data) {
				console.log(data);
				$scope.meetings = data;
			});
		};

		$scope.addSchedule = function(schedule){
			var committee = $scope.committee;
			var scheduleById = schedule._id;
			console.log('committee: '+committee._id);
			console.log('committee: '+scheduleById);
			$scope.committee.schedules.push(schedule._id);
			$scope.committee.$update(function() {
				// $location.path('committees/' + committee._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.addMeeting = function(meeting){
			var committee = $scope.committee;
			var meetingById = meeting._id;
			var Meetings = Committees.Meetings.put({committeeId: committee._id, meetingId: meetingById}).$promise.then(function(data) {
				console.log(data);
				$scope.meetings = data;
			});
		};
		$scope.removeMeeting = function(meeting){
			var committee = $scope.committee;
			var meetingById = meeting._id;
			var Meetings = Committees.Meetings.delete({committeeId: committee._id, meetingId: meetingById}).$promise.then(function(data) {
				console.log(data);
				$scope.meetings = data;
			});
		};

		$scope.setChair = function(userId){
			var committee = $scope.committee;
			Committees.Chair.update({committeeId: committee._id, chairId: userId}).$promise.then(function(data) {
				console.log(data);
				$scope.committee = data;
			});
		};

		$scope.removeChair = function(){
			var committee = $scope.committee;
			Committees.Chair.delete({committeeId: committee._id, chairId: committee.chair}).$promise.then(function(data) {
				console.log(data.displayName);
				$scope.committee = data;

			});
		};

		$scope.getChair = function(){
			var committee = $scope.committee;
			Committees.Chair.get({committeeId: committee._id, chairId: committee.chair}).$promise.then(function(data) {
				$log.debug($scope.committee.name + ' Chair: ' + data.displayName);
				$scope.chair = data;
			});
		};

		/* Attendance Checking */
		$scope.membersPresent = 0;

		$scope.checkMembersPresent = function(isChecked){
			// $log.debug('Committee Members:');
			// $log.debug($scope.members);

			// $log.debug('isChecked:');
			// $log.debug(isChecked);

			if(isChecked === true){
				$scope.membersPresent++;
			}

			if(isChecked === false){
				$scope.membersPresent--;
			}
		};

		/* Committee Function Calls */

		/* Clean Up on Exit */
		$scope.$on("$destroy", function() {
			$scope.committeeTemplates.edit = false;
			$scope.committeeTemplates.attendance = false;
			$scope.committeeTemplates.schedule = false;
			$scope.committeeTemplates.resources = false;
		});

	}
]);