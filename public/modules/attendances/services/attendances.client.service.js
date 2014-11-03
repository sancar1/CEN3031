'use strict';

//Attendances service used to communicate Attendances REST endpoints
angular.module('attendances').factory('Attendances', ['$resource',
	function($resource) {
		return{
			Attendances: $resource('attendances/:attendanceId', { attendanceId: '@_id'}, {update: {method: 'PUT'}}),
			Attendees: $resource('attendances/:attendanceId/attendees', {attendanceId: '@_id'}),
		};
	}
]);