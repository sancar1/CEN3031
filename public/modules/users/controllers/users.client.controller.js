'use strict';

angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Users', 'Authentication',
	function($scope, $stateParams, $location, Users, Authentication) {
		$scope.authentication = Authentication;

		$scope.find = function() {
			$scope.users= Users.query();
		};
		$scope.findOne = function() {
			$scope.user = Users.get({
				userId: $stateParams.userId
			});
		};
		$scope.usersInCommittee = function(committee){
			console.log(committee.members);
			$scope.members = committee.members;
			/*for(var i = 0; i < committee.members.length; i++){
				var temp = committee.members[i]._id;
				console.log(temp);
				//console.log(Users.get({userId: $stateParams.userId});
				console.log(Users.get({
					 temp: $stateParams.userId
				}));
			}*/		
		};
	}
]);




