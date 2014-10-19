'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	User = mongoose.model('User'),
	Meeting = mongoose.model('Meeting'),
	_ = require('lodash');

/**
 * Create a Meeting
 */
exports.create = function(req, res) {
	var meeting = new Meeting(req.body);
	meeting.user = req.user;

	meeting.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(meeting);
		}
	});
};

/**
 * Show the current Meeting
 */
exports.read = function(req, res) {
	res.jsonp(req.meeting);
};

/**
 * Update a Meeting
 */
exports.update = function(req, res) {
	var meeting = req.meeting ;

	meeting = _.extend(meeting , req.body);

	meeting.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(meeting);
		}
	});
};

/**
 * Delete an Meeting
 */
exports.delete = function(req, res) {
	var meeting = req.meeting ;

	meeting.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(meeting);
		}
	});
};

/**
 * Get Notetaker
 */
exports.getNotetaker = function(req, res) {
	var noteTakerById = req.committee.noteTaker;

	User.find({'_id': noteTakerById}).exec(function(err, noteTaker) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(noteTaker[0]);
		}
	});
};

/**
 * Set Notetaker
 */
exports.setNotetaker = function(req, res) {
	var meetingById = req.meeting._id;
	var noteTakerById = req.params.userId;

	Meeting.update({'_id': meetingById},{'noteTaker': noteTakerById}).exec(function(err, meeting) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(meeting[0]);
		}
	});
};

/**
 * Remove Notetaker
 */
exports.removeNotetaker = function(req, res) {
	var meetingById = req.meeting._id ;

	Meeting.update({'_id': meetingById},{'noteTaker': ''}).exec(function(err, meeting) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(meeting[0]);
		}
	});
};

/**
 * List of Meetings
 */
exports.list = function(req, res) { 
	Meeting.find().sort('-created').populate('user', 'displayName').exec(function(err, meetings) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(meetings);
		}
	});
};

/**
 * Meeting middleware
 */
exports.meetingByID = function(req, res, next, id) { 
	Meeting.findById(id).populate('user', 'displayName').exec(function(err, meeting) {
		if (err) return next(err);
		if (! meeting) return next(new Error('Failed to load Meeting ' + id));
		req.meeting = meeting ;
		next();
	});
};

/**
 * Meeting authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.meeting.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};