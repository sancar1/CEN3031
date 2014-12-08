'use strict';

// Agendaitems controller
angular.module('agendaitems').controller('AgendaItemsCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Agendaitems', 'Roles', '$state',
	function($scope, $stateParams, $location, Authentication, Agendaitems, Roles, $state ) {
		$scope.authentication = Authentication;

		// Create new Agendaitem
		// $scope.create = function() {
		// 	// Create new Agendaitem object
		// 	var agendaitem = new Agendaitems ({
		// 		name: this.name
		// 	});

		// 	// Redirect after save
		// 	agendaitem.$save(function(response) {
		// 		$location.path('agendaitems/' + response._id);

		// 		// Clear form fields
		// 		$scope.name = '';
		// 	}, function(errorResponse) {
		// 		$scope.error = errorResponse.data.message;
		// 	});
		// };

		$scope.createAgendaItem = function() {

			var agendaObj = new Agendaitems({
				name: $scope.agendaItem.name,
				owner: $scope.currentUser._id,
				committee: $scope.agendaItem.committee,
				description: null
			});
			agendaObj.$save(function() {
				$location.path('/agendaItems');
				//$state.reload();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Agendaitem
		$scope.remove = function( agendaitem ) {
			if ( agendaitem ) { agendaitem.$remove();

				for (var i in $scope.agendaitems ) {
					if ($scope.agendaitems [i] === agendaitem ) {
						$scope.agendaitems.splice(i, 1);
					}
				}
			} else {
				$scope.agendaitem.$remove(function() {
					$location.path('agendaitems');
				});
			}
		};

		// Update existing Agendaitem
		$scope.update = function() {
			var agendaitem = $scope.agendaitem ;

			agendaitem.$update(function() {
				$location.path('agendaitems/' + agendaitem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Agendaitems
		// $scope.find = function() {
		// 	$scope.agendaitems = Agendaitems.query();
		// };

		// Find existing Agendaitem
		$scope.findOne = function() {
			$scope.agendaitem = Agendaitems.get({ 
				agendaitemId: $stateParams.agendaitemId
			});
		};

		$scope.viewPendingItems = function(item){
			if($scope.committee._id === item.committee){
				if((Roles.get().admin === true || $scope.committee.chair === $scope.currentUser._id) && item.Status === 0){
					return true;
				}
				return false;
			}
			return false;
		};

		$scope.viewPublicItems = function(item){
			console.log('here');
			if($scope.committee._id === item.committee){
				if((Roles.get().admin === true || $scope.committee.chair === $scope.currentUser._id) && item.Status === 1){
					item.Public = true;
					return true;
				}
				return false;
			}
			return false;
		};

		$scope.viewPrivateItems = function(item){
			if($scope.committee._id === item.committee){
				if((Roles.get().admin === true || $scope.committee.chair === $scope.currentUser._id) && item.Status === 2){
					// item.Private = true;
					return true;
				}
				return false;
			}
			return false;
		};

		$scope.viewRejectedItems = function(item){
			if($scope.committee._id === item.committee){
				if((Roles.get().admin === true || $scope.committee.chair === $scope.currentUser._id) && item.Status === 3){
					// item.reject = true;
					return true;
				}
				return false;
			}
			return false;
		};

		$scope.uncheck = function(item){
			if(item.reject === false){
				item.Public = item.oldPublic;
				item.Private = item.oldPrivate;
				item.voteable = item.oldVoteable;
			}
			else{
				item.oldPublic = item.Public;
				item.oldPrivate = item.Private;
				item.oldVoteable = item.voteable;
				item.Public = false; 
				item.Private = false;
				item.voteable = false;
			}
		};

		$scope.updateApprovals = function(){
			console.log($scope.agendaitems);
			for(var i = 0; i < $scope.agendaitems.length; i++){
				if($scope.agendaitems[i].reject)
					$scope.agendaitems[i].Status = 3;
				else if($scope.agendaitems[i].Public)
					$scope.agendaitems[i].Status = 1;
				else if($scope.agendaitems[i].Private)
					$scope.agendaitems[i].Status = 2;

				var agendaItems = $scope.agendaitems[i];

				agendaItems.$update();
			}

			$state.reload();
		};
	}
]);