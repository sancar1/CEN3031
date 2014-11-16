'use strict';

angular.module('core').controller('CommitteesCtrl', ['$scope', '$log', '$q', '$stateParams', '$location', '$filter', 'Authentication', 'Committees', 'Users', 'Roles',
	function($scope, $log, $q, $stateParams, $location, $filter, Authentication, Committees, Users, Roles) {
		// Redirect to home page if logged in
		if(Authentication.user) $location.path('/');

		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.currentUser = Authentication.user;

		// Default values for Committee
		$scope.committeeTemplates = {
			'current' : false,
			'edit' : false,
			'attendance' : false,
			'schedule' : false,
			'meetings' : false
		};

		/* Application Services to be Loaded on Page Load */
		// Find a List of Committees
		Committees.Committees.query().$promise.then(function(data) {
			$scope.committees = data;
			$log.info('List of Committees Loaded');
		});

		/* Application Functions */
		// Determines whether user can see a committee
		$scope.viewCommittee = function(committee) {
			// var debugObj = {
			// 				'checkAdmin' : $scope.role.admin,
			// 				'checkOwner' : $scope.checkOwner(committee),
			// 				'userInCommittee' : $scope.userInCommittee(committee)
			// 			};

			// $log.debug('Debug Statement:');
			// $log.debug(debugObj);
			// $log.debug('Entered viewCommittee');
			
			if(Roles.get().admin === true || Committees.checkOwner(committee) === true || Committees.userInCommittee(committee) === true){
				return true;
			}
			return false;
		};

		// Find existing Committee
		$scope.findCommittee = function() {

			return Committees.Committees.get({
				committeeId: $stateParams.committeeId
			}).$promise.then(function(data) {
				$scope.committee = data;
			});

		};

		// Sprint 2 Temp fix
		$scope.lastCommittee = function(commMembers) {
			$log.debug('Entered last committee');
			// if(!($scope.committee._id === $scope.currentCommitteeObjects.committee._id)) {
				$scope.currentCommitteeObjects = {
					'committee' : $scope.committee,
					'members' : commMembers
				};
			// }
			$log.debug('currentCommitteeObject');
			$log.debug($scope.currentCommitteeObjects);
		};

		/* Application Function Calls */

	}
]);