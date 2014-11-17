'use strict';

angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Users', 'Authentication',
	function($scope, $stateParams, $location, Users, Authentication) {
		$scope.authentication = Authentication;

		/*//Find users in the db
		$scope.users= Users.query();*/

		$scope.findOne = function() {
			$scope.user = Users.get({
				userId: $stateParams.userId
			});
		};
		$scope.users= Users.query();
		$scope.inCommittee = function(user){
			if(typeof $scope.committee !== 'undefined'){

				for(var i = 0; i < $scope.committee.members.length; i++){
					if(user._id === $scope.committee.members[i]) return true;
				}
				return false;
			}
			return false;	
		};

		$scope.find = function(){
			$scope.users = Users.query();
		};
	}
]);




