'use strict';

//Schedules service used to communicate Schedules REST endpoints
angular.module('schedules').factory('Schedules', ['$resource',
	function($resource) {
		return {
			Schedules: $resource('schedules/:scheduleId', { scheduleId: '@_id'}, {update: {method: 'PUT'}}),
			Event:     $resource('schedules/event/:scheduleId',{ scheduleId: '@_id'}),
		};
	}
]);