'use strict';

//Setting up route
angular.module('meetings').config(['$stateProvider',
	function($stateProvider) {
		// Meetings state routing
		$stateProvider.
		state('listMeetings', {
			url: '/meetings',
			templateUrl: 'modules/meetings/views/list-meetings.client.view.html'
		}).
		state('createMeeting', {
			url: '/committees/:committeeId/meetings/create',
			templateUrl: 'modules/meetings/views/create-meeting.client.view.html'
		}).
		state('viewMeeting', {
			url: '/meetings/:meetingId',
			templateUrl: 'modules/meetings/views/view-meeting.client.view.html'
		}).
		state('editMeeting', {
			url: '/meetings/:meetingId/edit',
			templateUrl: 'modules/meetings/views/edit-meeting.client.view.html'
		});
	}
]);