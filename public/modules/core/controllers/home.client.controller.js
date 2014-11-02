'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Committees', '$filter', '$log', '$location',
	function($scope, Authentication, Committees, $filter, $log, $location) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.currentUser = Authentication.user;

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

		$scope.getRole = function() {

			if($filter('lowercase')($scope.currentUser.role) === 'admin')
				$scope.role.admin = true;
			if($filter('lowercase')($scope.currentUser.role) === 'user')
				$scope.role.user = true;
		};

		$scope.getRole();

		if ($scope.authentication.user) {
			$scope.currentUser = Authentication.user;
			$location.path('/');
		}

		// Find a List of Committees
		Committees.Committees.query().$promise.then(function(data) {
			$scope.committees = data;
			$log.info('List of Committees Loaded');
		});
	}
]);