'use strict';

//Meetings service used to communicate Meetings REST endpoints
angular.module('meetings').factory('Meetings', ['$resource',
	function($resource) {
		return {
			Meetings: 	$resource('meetings', {committeeId: 'committeeId'},{query: {method: 'GET', isArray: true}, update: {method: 'PUT'}}),
			List:        $resource('meetings/:committeeId', {committeeId: 'committeeId'},{query: {method: 'GET', isArray: true}}),
			Meeting: 	$resource('meetings/:meetingId/:committeeId', { meetingId: '@_id', committeeId: '@committeeId'}, {update: {method: 'PUT'}}),
			NoteTaker: 	$resource('meetings/:meetingId/:committeeId/:userId', { meetingId: '@_id', userId: 'userId'}, {update: {method: 'PUT'}}),
		};
	}
]);