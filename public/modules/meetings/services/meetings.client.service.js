'use strict';

//Meetings service used to communicate Meetings REST endpoints
angular.module('meetings').factory('Meetings', ['$resource',
	function($resource) {
		return {
			List: 		$resource('meetings/:committeeId', {committeeId: 'committeeId'},{query: {method: 'GET', isArray: true}}),
			Meeting: 	$resource('meetings/:meetingId', { meetingId: '@_id', committeeId: 'committeeId'}, {update: {method: 'PUT'}}),
			NoteTaker: 	$resource('meetings/:meetingId/noteTaker', { meetingId: '@_id'}, {update: {method: 'PUT'}}),
		};
	}
]);