'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var committees = require('../../app/controllers/committees');
	var schedules = require('../../app/controllers/schedules');

	// Committees Routes
	app.route('/committees')
		.get(committees.list)
		.post(users.requiresLogin, committees.isAdmin, committees.create);

	app.route('/committees/:committeeId')
		.get(committees.read)
		.put(users.requiresLogin, committees.isAdmin, committees.update)
		.delete(users.requiresLogin, committees.isAdmin, committees.delete);


	app.route('/committees/:committeeId/members')		
		.get(committees.getMembers);


	app.route('/committees/:committeeId/:userId')
		.put(users.requiresLogin, committees.isChairAdmin, committees.addMember)
		.delete(users.requiresLogin, committees.isChairAdmin, committees.removeMember);

	app.route('/committees/:committeeId/committeeChair/:userId')
		.get(committees.getChair)
		.put(users.requiresLogin, committees.isAdmin, committees.setChair)
		.delete(users.requiresLogin, committees.isAdmin, committees.removeChair);

	app.route('/committees/:committeeId/:scheduleId')
		.put(committees.addSchedule);
		

	// Finish by binding the Committee middleware
	app.param('committeeId', committees.committeeByID);
	app.param('userId', users.userByID);
	app.param('scheduleId', schedules.scheduleByID);
};