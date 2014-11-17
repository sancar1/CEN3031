'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var committees = require('../../app/controllers/committees');
	var meetings = require('../../app/controllers/meetings');
	var schedules = require('../../app/controllers/schedules');

	// Committees Routes
	app.route('/committees')
		.get(committees.list)
		.post(users.requiresLogin, committees.create);

	app.route('/committees/:committeeId')
		.get(committees.read)
		.put(users.requiresLogin, committees.hasAuthorization, committees.update)
		.delete(users.requiresLogin, committees.hasAuthorization, committees.delete);


	app.route('/committees/:committeeId/members')		
		.get(committees.getMembers);

	// app.route('/committees/:committeeId/meetings/:meetingId')
	// 	.put(committees.addMeeting)
	// 	.delete(committees.removeMeeting);

	app.route('/committees/:committeeId/:userId')
		.put(committees.addMember)
		.delete(committees.removeMember);

	app.route('/committees/:committeeId/committeeChair/:userId')
		.get(committees.getChair)
		.put(committees.setChair)
		.delete(committees.removeChair);

	app.route('/committees/:committeeId/:scheduleId')
		.put(committees.addSchedule);
		

	// Finish by binding the Committee middleware
	app.param('committeeId', committees.committeeByID);
	app.param('userId', users.userByID);
	app.param('meetingId', meetings.meetingByID);
	app.param('scheduleId', schedules.scheduleByID);
};