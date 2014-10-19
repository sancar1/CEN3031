'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var committees = require('../../app/controllers/committees');

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

	app.route('/committees/:committeeId/:userId')
		.put(committees.addMember)
		.delete(committees.removeMember);

	app.route('/committees/:committeeId/committeeChair/:userId')
		.get(committees.getChair)
		.put(committees.setChair)
		.delete(committees.removeChair);

	// Finish by binding the Committee middleware
	app.param('committeeId', committees.committeeByID);
	app.param('userId', users.userByID);
};