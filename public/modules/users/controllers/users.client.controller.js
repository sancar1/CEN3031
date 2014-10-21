'use strict';

angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Users', 'Authentication',
	function($scope, $stateParams, $location, Users, Authentication) {
		$scope.authentication = Authentication;

		//Find users in the db
		$scope.users= Users.query();

		$scope.findOne = function() {
			$scope.user = Users.get({
				userId: $stateParams.userId
			});
		};
		$scope.inCommittee = function(user){
			//console.log($scope.committee.members);
			//console.log($scope.committee._id);
			//console.log(user);

			if(typeof $scope.committee !== 'undefined'){
				for(var i = 0; i < $scope.committee.members.length; i++){
					if(user._id === $scope.committee.members[i]._id){
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
	}
]);




