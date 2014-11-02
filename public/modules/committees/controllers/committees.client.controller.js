'use strict';

// Committees controller
angular.module('committees').controller('CommitteesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users', 'Committees', '$q', '$log',
	function($scope, $stateParams, $location, Authentication,Users, Committees, $q, $log) {
		$scope.authentication = Authentication;
		$scope.currentUser = Authentication.user;

		

		

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

			Committees.Committees.get({
				committeeId: $stateParams.committeeId
			}).$promise.then(function(data) {
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
		
	}
]);