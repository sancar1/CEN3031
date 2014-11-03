'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$logProvider',
	function($stateProvider, $urlRouterProvider, $logProvider) {
		// Setting Debug Statements
		$logProvider.debugEnabled(true);

		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/prelogin');

		// Home state routing
		$stateProvider.
		state('prelogin', {
			url: '/prelogin',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('home', {
			url: '/',
			templateUrl: 'modules/committees/views/list-committees.client.view.html'
		}).
		state('edit', {
			url: '/committees/:committeeId/edit',
			templateUrl: 'modules/committees/views/edit-committee.client.view.html'
			// controller: 'CommitteesController'
		}).
		state('attendance', {
			url: '/committee/attendance',
			templateUrl: 'modules/committees/views/attendance.client.view.html'
			// controller: 'CommitteesController'
		}).
		state('schedule', {
			url: '/committee/schedule',
			templateUrl: 'modules/schedules/views/schedule.client.view.html'
		}).
		state('resources', {
			url: '/committee/resources',
			templateUrl: 'modules/committees/views/resources.client.view.html'
		});
	}
]);