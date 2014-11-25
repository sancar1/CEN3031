'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Schedule = mongoose.model('Schedule'),
	nodemailer = require('nodemailer'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Schedule
 */
exports.create = function(req, res) {
	var schedule = new Schedule(req.body);
	schedule.user = req.user;

	schedule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(schedule._id);
			res.jsonp(schedule);
		}
	});
};

/**
 * Show the current Schedule
 */
exports.read = function(req, res) {
	res.jsonp(req.schedule);
};

/**
 * Update a Schedule
 */
exports.update = function(req, res) {
	var schedule = req.schedule ;

	schedule = _.extend(schedule , req.body);

	schedule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} 
		else res.jsonp(schedule);
	});
};

/**
 * Delete an Schedule
 */
exports.delete = function(req, res) {
	var schedule = req.schedule ;

	schedule.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else res.jsonp(schedule);
	});
};

/**
 * Add event to schedule
 */
exports.getEvents = function(req, res) {
	var scheduleById = req.schedule._id;

	async.waterfall([
		function(done){
			Schedule.find({'_id': scheduleById}).exec(function(err, schedule){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else done(err,schedule[0].events);
			});
			
		}/*,
		function(user, done) {
			res.render('templates/add-to-committee', {
				name: user.displayName,
				committee: req.committee.name,
				appName: config.app.title
			}, function(err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, user, done) {
			var smtpTransport = nodemailer.createTransport(config.mailer.options);
			var mailOptions = {
				to: user.email,
				from: config.mailer.from,
				subject: 'Added to a committee',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function(err, info) {
				if (err) console.log('message not sent: ' + console.log(err));
				else console.log('message sent: ' + console.log(info));
				done(err);
			});
		}*/
		],function(err){
			if(err) console.log(err);
		});
};

/**
 * Add event to schedule
 */
exports.addEvent = function(req, res) {
	var scheduleById = req.schedule._id;
	var Event = req.eventToAdd;

	console.log(Event);

	async.waterfall([
		function(done){
			Schedule.update({'_id': scheduleById}, {$addToSet:{'events': Event}}).exec(function(err, schedule){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else done(err,schedule[0]);
			});
			
		}/*,
		function(user, done) {
			res.render('templates/add-to-committee', {
				name: user.displayName,
				committee: req.committee.name,
				appName: config.app.title
			}, function(err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, user, done) {
			var smtpTransport = nodemailer.createTransport(config.mailer.options);
			var mailOptions = {
				to: user.email,
				from: config.mailer.from,
				subject: 'Added to a committee',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function(err, info) {
				if (err) console.log('message not sent: ' + console.log(err));
				else console.log('message sent: ' + console.log(info));
				done(err);
			});
		}*/
		],function(err){
			if(err) console.log(err);
		});
};

/**
 *Remove event from schedule
 */
exports.removeEvent = function(req, res) {
	var scheduleById = req.schedule._id;
	var Event = req.schedule.eventToRemove;

	async.waterfall([
		function(done){
			Schedule.update({'_id': scheduleById}, {$pull:{'events': Event}}).exec(function(err, schedule){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else done(err,schedule[0]);
			});
			
		}/*,
		function(user, done) {
			res.render('templates/add-to-committee', {
				name: user.displayName,
				committee: req.committee.name,
				appName: config.app.title
			}, function(err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, user, done) {
			var smtpTransport = nodemailer.createTransport(config.mailer.options);
			var mailOptions = {
				to: user.email,
				from: config.mailer.from,
				subject: 'Added to a committee',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function(err, info) {
				if (err) console.log('message not sent: ' + console.log(err));
				else console.log('message sent: ' + console.log(info));
				done(err);
			});
		}*/
		],function(err){
			if(err) console.log(err);
		});
};

/**
 * List of Schedules
 */
exports.list = function(req, res) { Schedule.find().sort('-created').populate('user', 'displayName').exec(function(err, schedules) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(schedules);
		}
	});
};

/**
 * Schedule middleware
 */
exports.scheduleByID = function(req, res, next, id) { Schedule.findById(id).populate('user', 'displayName').exec(function(err, schedule) {
		if (err) return next(err);
		if (! schedule) return next(new Error('Failed to load Schedule ' + id));
		req.schedule = schedule ;
		next();
	});
};

/**
 * Schedule authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.schedule.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};