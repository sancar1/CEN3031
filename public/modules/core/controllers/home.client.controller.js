'use strict';

angular.module('core').controller('CommitteesCtrl', ['$scope', '$log', '$q', '$stateParams', '$location', '$filter', 'Authentication', 'Committees', 'Users',
	function($scope, $log, $q, $stateParams, $location, $filter, Authentication, Committees, Users) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.currentUser = Authentication.user;

		// Redirect to home page if logged in
		if ($scope.authentication.user) {
			$scope.currentUser = Authentication.user;
			$location.path('/');
		}

		/* Application Default Values */
		// Default values for Roles
		$scope.role = {
			'admin' : false,
			'user' : false,
		};

		// Default values for Committee
		$scope.committeeTemplates = {
			'edit' : false,
			'attendance' : false,
			'schedule' : false,
			'resources' : false
		};

		/* Application Services to be Loaded on Page Load */
		// Find a List of Committees
		Committees.Committees.query().$promise.then(function(data) {
			$scope.committees = data;
			$log.info('List of Committees Loaded');
		});

		/* Application Functions */
		$scope.getRole = function() {
			$log.debug('getRole() Called');

			if($filter('lowercase')($scope.currentUser.role) === 'admin')
				$scope.role.admin = true;
			if($filter('lowercase')($scope.currentUser.role) === 'user')
				$scope.role.user = true;
		};

		// Checks if user is owner of a committee
		$scope.checkOwner = function(committee){
			if($scope.currentUser.displayName===committee.user.displayName){
				return true;
			}
			else{
				return false;
			}
		};

		// Checks if user is in a committee
		$scope.userInCommittee = function(committee){

			if(typeof committee !== 'undefined'){
				for(var i = 0; i < committee.members.length; i++){
					if($scope.currentUser._id === committee.members[i]){
						return true;
					}
				}
				return false;
			}
			return false;
		};

		// Determines whether user can see a committee
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

		// Find existing Committee
		$scope.findCommittee = function() {

			$log.debug('Entered findCommittee()');

			// var test =

			return Committees.Committees.get({
				committeeId: $stateParams.committeeId
			}).$promise.then(function(data) {
				$log.debug('Data returned from findCommittee() promise.');
				
				$scope.committee = data;
				
			});

			// test.then(function(data) {
			// 	$log.debug('Chained promise call');
			// });

		};

		/* Functions to modify/delete */
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

		/* Application Function Calls */
		$scope.getRole();
	}
]);