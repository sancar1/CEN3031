'use strict';

// Committees controller
angular.module('committees').controller('CommitteesController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication', 'Users', 'Committees', '$q', '$log',
	function($rootScope, $scope, $stateParams, $location, Authentication,Users, Committees, $q, $log) {
		$scope.authentication = Authentication;
		$scope.currentUser = Authentication.user;

		// Create new Committee
		$scope.create = function($scope) {
			// Create new Committee object

			// $scope.chair.id;
			// $scope.name = 'TEST NAME';

			$log.debug('Chair Id:');
			$log.debug(this.chair_id);

			var committee = new Committees.Committees ({
				name: this.name,
				chair: this.chair_id
			});

			// Redirect after save
			committee.$save(function(response) {
				$location.path('committees/' + response._id);

				// Clear form fields
				//$scope.name = '';
			}, function(errorResponse) { 
				$scope.error = errorResponse.data.message;
			});
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
			if(passed)Committees.Member.update({userId: user._id,committeeId: committee._id});
			
		};

		$scope.removeMember = function(member){
			var committee = $scope.committee;
			var passed = 0;		
			angular.forEach(committee.members, function(members){
				if(members === member._id) passed = 1;
			});
			if(passed) Committees.Member.remove({userId: member._id,committeeId: committee._id});
		};

		$scope.getMembers = function(){
			var committee = $scope.committee;
			var Members = Committees.Members.query({committeeId: committee._id}).$promise.then(function(data) {
				console.log(data);
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

		$scope.setChair = function(user){
			var committee = $scope.committee;
			Committees.Chair.update({committeeId: committee._id, chairId: user._id}).$promise.then(function(data) {
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
				console.log('chair: ');
				console.log(data.displayName);
				$scope.chair = data;
			});
		};

		// Find a list of Committees
		$scope.find = function() {
			// $scope.committees = Committees.query();

			Committees.Committees.query().$promise.then(function(data) {
				$scope.committees = data;

				// $log.debug('data: ');
				// $log.debug(data);

				// $log.debug('$scope.committees: ');
				// $log.debug($scope.committees);
			});

		};

		$scope.checkAdmin = function(){
			var user = new Users($scope.currentUser);
			if(user.role === 'Admin'){
				return true;
			}
			else{
				return false;
			}
		};
		
		$scope.checkLoggedIn = function(){
			var user = new Users($scope.currentUser);
			if(!$scope.currentUser){
				return false;
			}
			else{
				return true;
			}
		};
		
		$scope.checkOwner = function(committee){
		//	var user = new Users($scope.currentUser);
		//	var committee = $scope.committee;
			if($scope.currentUser.displayName===committee.user.displayName){
				return true;
			}
			else{
				return false;
			}
		};
		
		$scope.userInCommittee = function(committee){
			//console.log($scope.committee.members);
			//console.log($scope.committee._id);
			//console.log(user);

			if(typeof committee !== 'undefined'){
				for(var i = 0; i < committee.members.length; i++){
					if($scope.currentUser._id === committee.members[i]._id){
						return true;
					}
				}
				return false;
			}
			return false;
			


			/*for(var i = 0; i < committee.members.length; i++){
				var temp = committee.members[i]._id;
				console.log(temp);
				//console.log(Users.get({userId: $stateParams.userId});
				console.log(Users.get({
					 temp: $stateParams.userId
				}));
			}*/		
		};
		
			
		// Find existing Committee
		$scope.findOne = function() {
			Committees.Committees.get({
				committeeId: $stateParams.committeeId
			}).$promise.then(function(data) {
				//TEMPORARY SOLUTION FOR SPRINT 1
				$rootScope.committee = data;
				
				// $log.debug('$scope.committee: ');
				// $log.debug($scope.committee);
				// $log.debug('$scope.committee._id');
				// $log.debug($scope.committee._id);
			});


			// $scope.test =

			// 	Committees.get({
			// 		committeeId: $stateParams.committeeId
			// 	}).$promise.then(function(data) {
			// 		$scope.committee = data;
			// 		return data;
			// 	});


			// test.then(function(data) {

			// 	// $log.debug( $state.href('edit', {data._id}) );

			// 	console.log("data:");
			// 	console.log(data);

			// 	console.log("$scope.committee:");
			// 	console.log($scope.committee);
			// 	console.log("$scope.committee.members:")
			// 	console.log($scope.committee.members);
			// 	console.log("$scope.committee.name:");
			// 	console.log($scope.committee.name);

			// });
		};

		// // Show edit button
		// $scope.showEdit = function($stateParams) {

		// 	$log.debug('$stateParams:');
		// 	$log.debug($stateParams.committeeId);
		// 	$log.debug('$scope.committee._id:');
		// 	$log.debug($scope.committee._id);

		// 	if($stateParams.committeeId === $scope.committee._id){
		// 		return true;
		// 	}

		// 	return false;

		// };
	}
]);