'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var meetings = require('../../app/controllers/meetings');
	var committees = require('../../app/controllers/committees');

	// Meetings Routes
	app.route('/meetings/:committeeId')
		.get(users.requiresLogin, meetings.list)
		.post(users.requiresLogin, meetings.isChairAdmin, meetings.create)
		.put(users.requiresLogin, meetings.isChairAdmin, meetings.update);
		
	app.route('/meetings/:committeeId/:meetingId')
		.get(users.requiresLogin, meetings.read)
		.delete(users.requiresLogin, meetings.isChairAdmin, meetings.delete);
		

	app.route('/meetings/:committeeId/:meetingId/:userId')
		.get(meetings.getNotetaker)
		.put(users.requiresLogin, meetings.isChair, meetings.setNotetaker)
		.delete(users.requiresLogin, meetings.isChair, meetings.removeNotetaker);

	// Finish by binding the Meeting middleware
	app.param('meetingId', meetings.meetingByID);
	app.param('userId', users.userByID);
	app.param('committeeId', committees.committeeByID);
};