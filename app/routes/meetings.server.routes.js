'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var meetings = require('../../app/controllers/meetings');
	var committees = require('../../app/controllers/committees');

	// Meetings Routes
	app.route('/meetings')
		.post(users.requiresLogin, meetings.create)
		.put(users.requiresLogin, meetings.hasAuthorization, meetings.update);
		
	app.route('/meetings/:committeeId')
		.get(meetings.list);
		
	app.route('/meetings/:meetingId/:committeeId')
		.get(meetings.read)
		.delete(users.requiresLogin, meetings.hasAuthorization, meetings.delete);

	app.route('/meetings/:meetingId/:committeeId/:userId')
		.get(meetings.getNotetaker)
		.put(meetings.setNotetaker)
		.delete(meetings.removeNotetaker);

	// Finish by binding the Meeting middleware
	app.param('meetingId', meetings.meetingByID);
	app.param('userId', users.userByID);
	app.param('committeeId', committees.committeeByID);
};