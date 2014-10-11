'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$stateParams', '$state',
	function($scope, Authentication, $stateParams, $state) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);