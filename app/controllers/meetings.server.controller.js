'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	User = mongoose.model('User'),
	Meeting = mongoose.model('Meeting'),
	Schedule = mongoose.model('Schedule'),
	Committee = mongoose.model('Committee'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Meeting
 */
exports.create = function(req, res) {
	var meeting = new Meeting(req.body);
	var scheduleById = req.body.scheduleById;
async.waterfall([
		function(done){
			meeting.save(function(err) {
				if (err) {
					console.log('error here');
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} 
				else done();
			});
		},function(done){
			var newEvent = {
				startTime: req.body.startTime,
				endTime: req.body.endTime,
				allDay: req.body.allDay,
				meeting: meeting._id
			};
			Schedule.update({'_id': scheduleById}, {$addToSet:{'events': newEvent}},function(err, committee){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else{
					res.jsonp(meeting);
				}
			});
				
		}/*,
		function(meeting, done){
			User.find({'_id': req.body.noteTaker},function(err, user){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else{
					console.log(user);
					done(err,user[0]);
				}
			});
		},
		function(user, done) {
			res.render('templates/add-as-chair', {
				name: user.displayName,
				committee: req.body.name,
				appName: config.app.title
			}, function(err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, user, done) {
			var mailOptions = {
				to: user.email,
				from: config.mailer.from,
				subject: 'Added as chair of a committee',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function(err, info) {
				if (err) console.log('message not sent: ' + console.log(err));
				else console.log('message sent: ' + console.log(info));
				done(err);
			});
		}*/
		],function(err){
			if(err){
				console.log('error saving meeting');
				console.log(err);
			}

	});
};

/**
 * Show the current Meeting
 */
exports.read = function(req, res) {
	var meetingById = req.meeting._id;
	console.log('here to find a meeting');
	Meeting.find({'_id':meetingById}).exec(function(err, meeting) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(meeting[0]);
		}
	});
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
	console.log('here in getNotetaker');
	var noteTakerById = req.meeting.noteTaker;

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
	//var committeeById = req.body.committee._id;
	var committeeById = req.params.committeeId;
	async.waterfall([
		//Find the committee
		function(done){
			Committee.find({'_id': committeeById}).exec(function(err, committee) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} 
				else{
					done(null,committee[0]);
				}
			});
		},function(committee, done){
			var scheduleById = committee.schedule;
			Schedule.find({'_id': scheduleById}).exec(function(err, schedule){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else{
					done(null, schedule[0]);
				}
			});
		},function(schedule, done){
			var meetings = [];
			console.log(schedule.events.length);
			for(var i = 0; i < schedule.events.length; i++){
				var temp = schedule.events[i].meeting;
				meetings[i] = mongoose.Types.ObjectId(temp);
			}
			Meeting.find({'_id':{$in: meetings}}).exec(function(err, meetings) {
				if (err) {
					console.log(err);
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					done(meetings);
					res.jsonp(meetings);
				}
			});
		}
		],function(err){
			if(err){
				console.log(err);
			}
		}
	);
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
	if (req.user.id !== 'Admin' || req.user.id !== 'Chair') {
		return res.status(403).send('User is not authorized');
	}
	next();
};