'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var agendaitems = require('../../app/controllers/agendaitems');

	// Agendaitems Routes
	app.route('/agendaitems')
		.get(agendaitems.list)
		.post(users.requiresLogin, agendaitems.create);

	app.route('/agendaitems/:agendaitemId')
		.get(agendaitems.read)
		.put(users.requiresLogin, agendaitems.hasAuthorization, agendaitems.update)
		.delete(users.requiresLogin, agendaitems.hasAuthorization, agendaitems.delete);

	// Finish by binding the Agendaitem middleware
	app.param('agendaitemId', agendaitems.agendaitemByID);
};