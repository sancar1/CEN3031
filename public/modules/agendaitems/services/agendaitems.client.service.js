'use strict';

//Agendaitems service used to communicate Agendaitems REST endpoints
angular.module('agendaitems').factory('Agendaitems', ['$resource',
	function($resource) {
		return $resource('agendaitems/:agendaitemId', { agendaitemId: '@_id'}, 
			{update: {method: 'PUT'},
			query: {method: 'GET', isArray: true}
		});
	}
]);