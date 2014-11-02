'use strict';

// Committees controller
angular.module('committees').controller('CommitteesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users', 'Committees', '$q', '$log',
	function($scope, $stateParams, $location, Authentication,Users, Committees, $q, $log) {
		$scope.authentication = Authentication;
		$scope.currentUser = Authentication.user;

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
					// $log.debug('Current User:');
					// $log.debug($scope.currentUser._id);

					// $log.debug('Committee Members ID:');
					// $log.debug(committee.members[i]._id);

					// $log.debug('Committee Members:');
					// $log.debug(committee.members);

					if($scope.currentUser._id === committee.members[i]){
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

			$log.debug('Current User:');
			$log.debug($scope.currentUser);

			if(!$scope.currentUser){
				return false;
			}
			else{
				return true;
			}
		};
		
		$scope.getMembers = function(){
			var committee = $scope.committee;
			var Members = Committees.Members.query({committeeId: committee._id}).$promise.then(function(data) {
				// $log.debug(data);
				$scope.members = data;
			});
		};

		$scope.getChair = function(){
			var committee = $scope.committee;
			Committees.Chair.get({committeeId: committee._id, chairId: committee.chair}).$promise.then(function(data) {
				$log.debug($scope.committee.name + ' Chair: ' + data.displayName);
				$scope.chair = data;
			});
		};
			
		// Find existing Committee
		$scope.findOne = function() {

			$log.debug('Entered findOne()');

			Committees.Committees.get({
				committeeId: $stateParams.committeeId
			}).$promise.then(function(data) {
				$log.debug('Data returned from findOne() promise.');
				$scope.committee = data;
				
				// $log.debug('$scope.committee: ');
				// $log.debug($scope.committee);

				$scope.getChair();
				$scope.getMembers();
				
			});


			// var test =

			// 	Committees.Committees.get({
			// 		committeeId: $stateParams.committeeId
			// 	}).$promise.then(function(data) {
			// 		$scope.committee = data;
			// 		return data;
			// 	});


			// test.then(function(data) {

			// 	$log.debug('data:');
			// 	$log.debug(data);

			// 	$log.debug('$scope.committee:');
			// 	$log.debug($scope.committee);
			// 	$log.debug('$scope.committee.members:');
			// 	$log.debug($scope.committee.members);
			// 	$log.debug('$scope.committee.name:');
			// 	$log.debug($scope.committee.name);

			// });
		};

		$scope.viewCommittee = function(committee) {
			// var debugObj = {
			// 				'checkAdmin' : $scope.role.admin,
			// 				'checkOwner' : $scope.checkOwner(committee),
			// 				'userInCommittee' : $scope.userInCommittee(committee)
			// 			};

			// $log.debug('Debug Statement:');
			// $log.debug(debugObj);
			
			if($scope.role.admin === true || $scope.checkOwner(committee) === true || $scope.userInCommittee(committee) === true){
				return true;
			}
			return false;
		};
		
	}
]);