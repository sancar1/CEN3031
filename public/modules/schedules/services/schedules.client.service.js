'use strict';

//Schedules service used to communicate Schedules REST endpoints
angular.module('schedules').factory('Schedules', ['$resource',
	function($resource) {
		return {
			Schedules: $resource('schedules/:scheduleId', { scheduleId: '@_id'}, {
				update: {method: 'PUT'}, 
				query: {method: 'GET', isArray: true}
			}),

			Event: $resource('schedules/event/:scheduleId',{ scheduleId: '@scheduleId'}, {
				update: {method: 'PUT'}
			}),
		};
	}
]);