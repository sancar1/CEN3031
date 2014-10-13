'use strict';

// Committees controller
angular.module('committees').controller('CommitteesController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication', 'Users', 'Committees', '$q', '$log',
	function($rootScope, $scope, $stateParams, $location, Authentication,Users, Committees, $q, $log) {
		$scope.authentication = Authentication;
		$scope.currentUser = Authentication.user;

		// Create new Committee
		$scope.create = function() {
			// Create new Committee object
			var committee = new Committees ({
				name: this.name,
				chair: this.chair
			});

			// Redirect after save
			committee.$save(function(response) {
				$location.path('committees/' + response._id);

				// Clear form fields
				$scope.name = '';
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
			var check = 1;
			for(var i = 0; i < committee.members.length; i++){
				if($scope.currentUser._id === committee.members[i]._id){
					check = 0;
				}
			}
			if(check===1){
			committee.members.push(user);}
			else{
				console.log("NOPE!");
			}
			committee.$update(function(){
				$location.path('committees/'+committee._id+'/edit');	
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.removeMember = function(index){
			var committee = $scope.committee;
			committee.members.splice(index, 1);
			committee.$update(function(){
				$location.path('committees/'+committee._id);	
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Committees
		$scope.find = function() {
			// $scope.committees = Committees.query();

			Committees.query().$promise.then(function(data) {
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
			};
		};
		
		$scope.checkLoggedIn = function(){
			var user = new Users($scope.currentUser);
			if(!$scope.currentUser){
				return false;
			}
			else{
				return true;
			};
		};
		
		$scope.checkOwner = function(committee){
		//	var user = new Users($scope.currentUser);
		//	var committee = $scope.committee;
			if($scope.currentUser.displayName===committee.user.displayName){
				return true;
			}
			else{
				return false;
			};
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
			Committees.get({
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