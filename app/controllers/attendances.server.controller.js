'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Attendance = mongoose.model('Attendance'),
	User = mongoose.model('User'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Attendance
 */
exports.create = function(req, res) {
	var attendance = new Attendance(req.body);
	attendance.user = req.user;

	attendance.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(attendance);
		}
	});
};

/**
 * Show the current Attendance
 */
exports.read = function(req, res) {
	res.jsonp(req.attendance);
};

/**
 * Update a Attendance
 */
exports.update = function(req, res) {
	var attendance = req.attendance ;

	for(var i =0; i < req.attendance.members.length; i++) 
		if(req.attendance.members[i].isPresent) req.attendance.membesPresent[i] = req.attendance.members[i];

	attendance = _.extend(attendance , req.body);

	attendance.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(attendance);
		}
	});
};

/**
 * Delete an Attendance
 */
exports.delete = function(req, res) {
	var attendance = req.attendance ;

	attendance.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(attendance);
		}
	});
};

/**
* Get Member Id's who showed up to a meeting
*/
exports.getAttendees = function(req,res){
	var attendanceById = req.attendance._id;

	async.waterfall([
		function(done){
			Attendance.find({'_id':'attendanceById'}).exec(function(err, attendance) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					done(err,attendance[0]);
				}
			});
		},
		function(attendance, done){
			User.find({'_id': {$in: attendance.membersPresent}}).exec(function(err, membersWhoAttended){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else{
					console.log(membersWhoAttended);
					done(err,membersWhoAttended);
				}
			});
		}
		],function(err){
			if(err) console.log(err);

	});
};

/**
 * List of Attendances
 */
exports.list = function(req, res) { Attendance.find().sort('-created').populate('user', 'displayName').exec(function(err, attendances) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(attendances);
		}
	});
};

/**
 * Attendance middleware
 */
exports.attendanceByID = function(req, res, next, id) { Attendance.findById(id).populate('user', 'displayName').exec(function(err, attendance) {
		if (err) return next(err);
		if (! attendance) return next(new Error('Failed to load Attendance ' + id));
		req.attendance = attendance ;
		next();
	});
};

/**
 * Attendance authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.attendance.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};