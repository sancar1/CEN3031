'use strict';

angular.module('committees').controller('CommitteesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Committees',
	function($scope, $stateParams, $location, Authentication, Committees) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var committee = new Committees({
				name: this.name
			});
			committee.$save(function(response) {
				$location.path('committees' + response._id);

				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(committee) {
			if (committee) {
				committee.$remove();

				for (var i in $scope.committees) {
					if ($scope.committees[i] === committee) {
						$scope.committees.splice(i, 1);
					}
				}
			} else {
				$scope.committee.$remove(function() {
					$location.path('committees');
				});
			}
		};

		$scope.update = function() {
			var committee = $scope.committee;

			committee.$update(function() {
				$location.path('committees/' + committee._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.addMember = function (){
    		location.path = ('#/users/list');
		};

		$scope.find = function() {
			$scope.committees = Committees.query();
		};
		$scope.findOne = function() {
			$scope.committee = Committees.get({
				committeeId: $stateParams.committeeId
			});
		};
	}
]);