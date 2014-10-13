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

	// Finish by binding the Committee middleware
	app.param('committeeId', committees.committeeByID);
	app.param('userId', users.userByID);
};