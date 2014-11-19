'use strict';

(function() {
	describe('CommitteesCtrl', function() {
		//Initialize global variables
		var scope,
			CommitteesCtrl;

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		beforeEach(inject(function($controller, $rootScope) {
			scope = $rootScope.$new();

			CommitteesCtrl = $controller('CommitteesCtrl', {
				$scope: scope
			});
		}));

		it('should expose the authentication service', function() {
			expect(scope.authentication).toBeTruthy();
		});
	});
})();