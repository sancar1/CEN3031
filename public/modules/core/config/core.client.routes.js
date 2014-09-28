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
		state('editCommittee', {
			url: '/attendance',
			templateUrl: 'modules/committees/views/edit-committee.client.view.html'
		}).
		state('attendance', {
			url: '/attendance',
			templateUrl: 'modules/committees/views/attendance.client.view.html'
		}).
		state('schedule', {
			url: '/schedule',
			templateUrl: 'modules/committees/views/schedule.client.view.html'
		}).
		state('resources', {
			url: '/resources',
			templateUrl: 'modules/committees/views/resources.client.view.html'
		});
	}
]);