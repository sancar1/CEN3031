'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('attendance', {
			url: '/committee/attendance',
			templateUrl: 'modules/committees/views/attendance.client.view.html'
		}).
		state('schedule', {
			url: '/committee/schedule',
			templateUrl: 'modules/committees/views/schedule.client.view.html'
		}).
		state('resources', {
			url: '/committee/resources',
			templateUrl: 'modules/committees/views/resources.client.view.html'
		});
	}
]);