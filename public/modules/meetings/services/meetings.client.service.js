'use strict';

//Meetings service used to communicate Meetings REST endpoints
angular.module('meetings').factory('Meetings', ['$resource',
	function($resource) {
		return {
			Meetings: $resource('meetings/:meetingId', { meetingId: '@_id'}, {update: {method: 'PUT'}}),
			noteTaker: $resource('meetings/:meetingId/noteTaker/:userId', { meetingId: '@_id', userId: '@userId'}, {update: {method: 'PUT'}}),
		};
	}
]);