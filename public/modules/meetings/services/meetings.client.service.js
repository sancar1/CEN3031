'use strict';

//Meetings service used to communicate Meetings REST endpoints
angular.module('meetings').factory('Meetings', ['$resource',
	function($resource) {
		return {
			Meetings: $resource('meetings/:meetingId', { meetingId: '@_id'}, {update: {method: 'PUT'}}),
			NoteTaker: $resource('meetings/:meetingId/noteTaker', { meetingId: '@_id'}, {update: {method: 'PUT'}}),
		};
	}
]);