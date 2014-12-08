'use strict';

//Meetings service used to communicate Meetings REST endpoints
angular.module('meetings').factory('Meetings', ['$resource',
	function($resource) {
		return {
			Meetings: 	$resource('meetings/:committeeId/:meetingId',{committeeId: '@committeeId', meetingId: '@_id'},{query: {method: 'GET', isArray: true}, update: {method: 'PUT'}, save:{method: 'POST'}}),
			Meeting: 	$resource('meetings/:committeeId/:meetingId', { meetingId: '@meetingId', committeeId: '@committeeId'}, {update: {method: 'PUT'}}),
			NoteTaker: 	$resource('meetings/:committeeId/:meetingId/:userId', { meetingId: '@meetingId', userId: '@userId'}, {update: {method: 'PUT'}}),
		};
	}
]);