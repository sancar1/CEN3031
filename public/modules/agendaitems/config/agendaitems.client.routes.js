'use strict';

//Setting up route
angular.module('agendaitems').config(['$stateProvider',
	function($stateProvider) {
		// Agendaitems state routing
		$stateProvider.
		state('listAgendaitems', {
			url: '/agendaitems',
			templateUrl: 'modules/agendaitems/views/list-agendaitems.client.view.html'
		}).
		state('createAgendaitem', {
			url: '/agendaitems/create',
			templateUrl: 'modules/agendaitems/views/create-agendaitem.client.view.html'
		}).
		state('viewAgendaitem', {
			url: '/agendaitems/:agendaitemId',
			templateUrl: 'modules/agendaitems/views/view-agendaitem.client.view.html'
		}).
		state('editAgendaitem', {
			url: '/agendaitems/:agendaitemId/edit',
			templateUrl: 'modules/agendaitems/views/edit-agendaitem.client.view.html'
		});
	}
]);