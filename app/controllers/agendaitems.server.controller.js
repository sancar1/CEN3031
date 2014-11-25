'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Agendaitem = mongoose.model('Agendaitem'),
	_ = require('lodash');

/**
 * Create a Agendaitem
 */
exports.create = function(req, res) {
	var agendaitem = new Agendaitem(req.body);
	agendaitem.user = req.user;

	agendaitem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(agendaitem);
		}
	});
};

/**
 * Show the current Agendaitem
 */
exports.read = function(req, res) {
	res.jsonp(req.agendaitem);
};

/**
 * Update a Agendaitem
 */
exports.update = function(req, res) {
	var agendaitem = req.agendaitem ;

	agendaitem = _.extend(agendaitem , req.body);

	agendaitem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(agendaitem);
		}
	});
};

/**
 * Delete an Agendaitem
 */
exports.delete = function(req, res) {
	var agendaitem = req.agendaitem ;

	agendaitem.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(agendaitem);
		}
	});
};

/**
 * List of Agendaitems
 */
exports.list = function(req, res) { Agendaitem.find().sort('-created').populate('user', 'displayName').exec(function(err, agendaitems) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(agendaitems);
		}
	});
};

/**
 * Agendaitem middleware
 */
exports.agendaitemByID = function(req, res, next, id) { Agendaitem.findById(id).populate('user', 'displayName').exec(function(err, agendaitem) {
		if (err) return next(err);
		if (! agendaitem) return next(new Error('Failed to load Agendaitem ' + id));
		req.agendaitem = agendaitem ;
		next();
	});
};