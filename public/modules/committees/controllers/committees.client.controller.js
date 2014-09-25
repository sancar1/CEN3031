'use strict';

// Committees controller
angular.module('committees').controller('CommitteesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Committees',
	function($scope, $stateParams, $location, Authentication, Committees ) {
		$scope.authentication = Authentication;

		// Create new Committee
		$scope.create = function() {
			// Create new Committee object
			var committee = new Committees ({
				name: this.name
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

		// Find a list of Committees
		$scope.find = function() {
			$scope.committees = Committees.query();
		};

		// Find existing Committee
		$scope.findOne = function() {
			$scope.committee = Committees.get({ 
				committeeId: $stateParams.committeeId
			});
		};
	}
]);