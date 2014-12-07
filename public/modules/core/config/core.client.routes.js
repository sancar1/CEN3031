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
			templateUrl: 'modules/core/views/prelogin.client.view.html'
		}).
		state('home', {
			url: '/',
			templateUrl: 'modules/committees/views/list-committees.client.view.html'
		}).
		state('viewCommittee', {
			url: '/committees/:committeeId',
			templateUrl: 'modules/committees/views/view-committee.client.view.html'
		}).
		state('editCommittee', {
			url: '/committees/:committeeId/edit',
			templateUrl: 'modules/committees/views/edit-committee.client.view.html'
		}).
		state('attendance', {
			url: '/committees/attendance',
			templateUrl: 'modules/committees/views/attendance.client.view.html'
			// controller: 'CommitteesController'
		}).
		state('schedule', {
			url: '/committees/schedule',
			templateUrl: 'modules/schedules/views/schedule.client.view.html'
		}).
		state('meetings', {
			url: '/committees/:committeeId/meetings',
			templateUrl: 'modules/meetings/views/list-meetings.client.view.html'
		}).
		state('listAgendaItems', {
			url: '/agendaItems',
			templateUrl: 'modules/agendaitems/views/list-agendaitems.client.view.html'
		}).
		state('reviewAgendaItems', {
			url: '/committees/:committeeId/agendaItems',
			templateUrl: 'modules/agendaitems/views/review-agenda-items.client.view.html'
		}).
		state('createAgendaItem', {
			url: '/agendaItems/create',
			templateUrl: 'modules/agendaitems/views/create-agendaitem.client.view.html'
		});
	}
]);