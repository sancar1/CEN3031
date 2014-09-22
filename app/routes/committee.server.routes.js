'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	users = require('../../app/controllers/users'),
	committees = require('../../app/controllers/committees');


module.exports =  function(app){
	//Committee Routes
	app.route('/committees')
		.get(committees.list)
		.post(users.requiresLogin, committees.create);

	app.route('/committees/:committeeId')
		.get(committees.read)
		.put(users.requiresLogin, committees.hasAuthorization, committees.update)
		.delete(users.requiresLogin, committees.hasAuthorization, committees.delete);

	// Finish by binding the committee middleware
	app.param('committeeId', committees.committeeByID);

};