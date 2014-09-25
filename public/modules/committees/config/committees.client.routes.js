'use strict';

//Setting up route
angular.module('committees').config(['$stateProvider',
	function($stateProvider) {
		// Committees state routing
		$stateProvider.
		state('listCommittees', {
			url: '/committees',
			templateUrl: 'modules/committees/views/list-committees.client.view.html'
		}).
		state('createCommittee', {
			url: '/committees/create',
			templateUrl: 'modules/committees/views/create-committee.client.view.html'
		}).
		state('viewCommittee', {
			url: '/committees/:committeeId',
			templateUrl: 'modules/committees/views/view-committee.client.view.html'
		}).
		state('editCommittee', {
			url: '/committees/:committeeId/edit',
			templateUrl: 'modules/committees/views/edit-committee.client.view.html'
		});
	}
]);