'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Committee = mongoose.model('Committee'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Committee
 */
exports.create = function(req, res) {
	var committee = new Committee(req.body);
	committee.user = req.user;

	committee.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(committee);
		}
	});
};

/**
 * Show the current Committee
 */
exports.read = function(req, res) {
	res.jsonp(req.committee);
};

/**
 * Update a Committee
 */
exports.update = function(req, res) {
	var committee = req.committee ;

	committee = _.extend(committee , req.body);

	committee.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(committee);
		}
	});
};

/**
 * Delete an Committee
 */
exports.delete = function(req, res) {
	var committee = req.committee;

	committee.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(committee);
		}
	});
};

/**
 * List of Committees
 */
exports.list = function(req, res) { 
	Committee.find().sort('-created').populate('user', 'displayName').exec(function(err, committees) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(committees);
		}
	});
};
/**
 * List of Committee Members
 */
exports.getMembers = function(req, res) { 
	var committee = req.committee;
	var memberById = committee.members;
	console.log(memberById);
	console.log(memberById.length);

	User.find({'_id':{$in: memberById}}).exec(function(err, members) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(members);
		}
	});
};




/**
 * Committee middleware
 */
exports.committeeByID = function(req, res, next, id) { Committee.findById(id).populate('user', 'displayName').exec(function(err, committee) {
		if (err) return next(err);
		if (! committee) return next(new Error('Failed to load Committee ' + id));
		req.committee = committee ;
		next();
	});
};

/**
 * Committee authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.committee.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};