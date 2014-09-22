'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Committee = mongoose.model('Committee'),
	_ = require('lodash');

/**
 * Create a Committee
 */
exports.create = function(req, res) {
	console.log('Here to create a committee');
	var committee = new Committee(req.body);
	committee.user = req.user;
	committee.save(function(err){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else{
			res.jsonp(committee);
		}
	});

};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.jsonp(req.committee);
};

/**
 * Update a Committee
 */
exports.update = function(req, res) {
	var committee = req.committee;
	committee = _.extend(committee, req.body);

	committee.save(function(err){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else{
			res.jsonp(committee);
		}
	});
};

/**
 * Delete a Committee
 */
exports.delete = function(req, res) {
	var committee = req.committee;
	committee.remove(function(err){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else{
			res.jsonp(committee);
		}
	});
};

/**
 * List of Committees
 */
exports.list = function(req, res) {
	Committee.find().sort('-created').populate('user','displayName').exec(function(err, committees){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else{
			res.jsonp(committees);
		}
	});
};

exports.committeeByID = function(req, res, next, id) {
	Committee.findById(id).populate('user').exec(function(err, committee) {
		if (err) return next(err);
		if (!committee) return next(new Error('Failed to load committee ' + id));
		req.committee = committee;
		next();
	});
};

/**
 * Committee authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if(req.user.role !== 'Super'){
		return res.status(403).send({
			message: 'User is not authorized to create committees'
		});
	}
	next();
};