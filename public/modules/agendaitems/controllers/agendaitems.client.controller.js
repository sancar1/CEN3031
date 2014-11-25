'use strict';

// Agendaitems controller
angular.module('agendaitems').controller('AgendaitemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Agendaitems',
	function($scope, $stateParams, $location, Authentication, Agendaitems ) {
		$scope.authentication = Authentication;

		// Create new Agendaitem
		$scope.create = function() {
			// Create new Agendaitem object
			var agendaitem = new Agendaitems ({
				name: this.name
			});

			// Redirect after save
			agendaitem.$save(function(response) {
				$location.path('agendaitems/' + response._id);

				// Clear form fields
				$scope.name = '';
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
		$scope.find = function() {
			$scope.agendaitems = Agendaitems.query();
		};

		// Find existing Agendaitem
		$scope.findOne = function() {
			$scope.agendaitem = Agendaitems.get({ 
				agendaitemId: $stateParams.agendaitemId
			});
		};
	}
]);