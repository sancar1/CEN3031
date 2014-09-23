'use strict';

angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Users', 'Authentication',
	function($scope, $stateParams, $location, Users, Authentication) {
		$scope.authentication = Authentication;

		$scope.find = function() {
			console.log('in here looking to query');
			$scope.users= Users.query();
			console.log($scope.users.length);

		};
		$scope.findOne = function() {
			$scope.user = Users.get({
				userId: $stateParams.userId
			});
		};
	}
]);



