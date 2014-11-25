'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var meetings = require('../../app/controllers/meetings');
	var committees = require('../../app/controllers/committees');

	// Meetings Routes
	app.route('/meetings')
		.post(users.requiresLogin, meetings.isChair, meetings.create)
		.put(users.requiresLogin, meetings.isChair, meetings.update);
		
	app.route('/meetings/:committeeId')
		.get(users.requiresLogin, meetings.list);
		
	app.route('/meetings/:meetingId/:committeeId')
		.get(users.requiresLogin, meetings.read)
		.delete(users.requiresLogin, meetings.isChair, meetings.delete);

	app.route('/meetings/:meetingId/:committeeId/:userId')
		.get(meetings.getNotetaker)
		.put(users.requiresLogin, meetings.isChair, meetings.setNotetaker)
		.delete(users.requiresLogin, meetings.isChair, meetings.removeNotetaker);

	// Finish by binding the Meeting middleware
	app.param('meetingId', meetings.meetingByID);
	app.param('userId', users.userByID);
	app.param('committeeId', committees.committeeByID);
};