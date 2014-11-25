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
	nodemailer = require('nodemailer'),
	async = require('async'),
	_ = require('lodash'),
	config = require('../../config/config');

//SMTP transport for sending email to people
var smtpTransport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    XOAuth2: {
      user: 'CACTUS.cen3031@gmail.com',
      clientId: '366804079742-1b51qcfrsjrrdf1btqd8e7ci797mlbck.apps.googleusercontent.com',
      clientSecret: 'kFrDQ6so_ZvNhCHiXrLvhlMY',
      refreshToken: '1/Bfd916IPNMj1xvDhU1UnRaPzbDUa8vHWzd_NKCHNhY0'
    }
  }
});

/**
 * Create a Meeting
 */
exports.create = function(req, res) {
	var meeting = new Meeting(req.body);
	var scheduleById = req.body.scheduleById;
	var tempUser;
	var tempMeeting;
async.waterfall([
		function(done){
			console.log('1');
			meeting.save(function(err) {
				if (err) {
					console.log('error here');
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} 
				else done(null, meeting);
			});
		},
		function(meeting,done){
			console.log('2');
			var newEvent = {
				title: req.body.name,
				start: req.body.startTime,
				end: req.body.endTime,
				allDay: req.body.allDay,
				meeting: meeting._id
			};
			Schedule.update({'_id': scheduleById}, {$addToSet:{'events': newEvent}},function(err){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else done(null);
			});
				
		},
		function(done){
			console.log('3');
			User.find({'_id': req.body.noteTaker},function(err, user){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else{
					tempUser = user[0];
					done(null);
				}
			});
		},
		function(done) {
			console.log('4');
			res.render('templates/add-as-notetaker', {
				name: tempUser.displayName,
				committee: req.body.name,
				appName: config.app.title
			}, function(err, emailHTML) {
				done(err, meeting,emailHTML, tempUser);
			});
		},
		// If valid email, send reset email using service
		function(meeting,emailHTML,done) {
			console.log('5');
			var mailOptions = {
				to: tempUser.email,
				from: config.mailer.from,
				subject: 'Added as notetaker of a meeting',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function(err, info) {
				if (err) console.log('message not sent: ' + console.log(err));
				else console.log('message sent: ' + console.log(info));
			});
			res.jsonp(meeting);
			
		}
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
	Meeting.find({'_id': req.meeting._id}).exec(function(err, meeting) {
				if (err) {
					console.log(err);
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else res.jsonp(meeting[0]);
			});
};
/**
 * Update a Meeting
 */
exports.update = function(req, res) {
/*
	var meeting = req.body ;
	meeting = _.extend(meeting , req.body);
	async.waterfall([
		//Find the committee
		function(done){
			Meeting.update({'_id': meeting._id},{'notes': meeting.notes}).exec(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} 
				else done(null);
			});
		},
		function(done){
			Meeting.update({'_id': meeting._id},{'name': meeting.name}).exec(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} 
				else done(null);
			});
		},
		function(done){
			Meeting.update({'_id': meeting._id},{'members': meeting.members}).exec(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} 
				else done(null);
			});
		},
		function(done){
			console.log(meeting.agendaItems);
			Meeting.update({'_id': meeting._id},{$set:{'agendaItems': meeting.agendaItems}}).exec(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} 
				else done(null);
			});
		},
		function(done){
			Meeting.update({'_id': meeting._id},{'membersPresent': meeting.membersPresent}).exec(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} 
				else done(null);
			});
		},
		function(done){
			Meeting.update({'_id': meeting._id},{'noteTaker': meeting.noteTaker}).exec(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} 
				else{
					done(null);
					res.jsonp();
				}
			});
		}
		],
		function(err){
			if(err) console.log(err);
		}
	);
*/
var meeting = req.meeting;
console.log(meeting);
	meeting = _.extend(meeting , req.body);
	meeting.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else res.jsonp(meeting);
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
		} 
		else res.jsonp(meeting);
	});
};

/**
 * Get Notetaker
 */
exports.getNotetaker = function(req, res) {
	console.log('here in getNotetaker');
	var temp = req.meeting.noteTaker;
	var noteTakerById = mongoose.Types.ObjectId(temp);

	User.find({'_id': noteTakerById}).exec(function(err, noteTaker) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} 
		else res.jsonp(noteTaker[0]);
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
		} 
		else res.jsonp(meeting[0]);
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
		} 
		else res.jsonp(meeting[0]);
	});
};

/**
 * List of Meetings
 */
exports.list = function(req, res) { 
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
				else done(null,committee[0]);
			});
		},function(committee, done){
			var scheduleById = committee.schedule;
			Schedule.find({'_id': scheduleById}).exec(function(err, schedule){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else done(null, schedule[0]);
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
				} else res.jsonp(meetings);
			});
		}
		],function(err){
			if(err) console.log(err);
		}
	);
};

/**
 * Meeting middleware
 */
exports.meetingByID = function(req, res, next, id) { 
	Meeting.findById(id).exec(function(err, meeting) {
		if (err) return next(err);
		if (! meeting) return next(new Error('Failed to load Meeting ' + id));
		req.meeting = meeting ;
		next();
	});
};

/**
 * Committee authorization middleware, are you an admin?
 */
exports.isChair = function(req, res, next) {
	var chairById = req.committee.chair;
	if (req.user.role !== chairById) {
		return res.status(666).send('User is not authorized, only Chairs can do this');
	}
	next();
};

/**
 * Committee authorization middleware, are you both?
 */
exports.isChairAdmin = function(req, res, next) {
	var chairById = req.params.chair;
	var userById = req.user._id.toString();
	if (chairById !== userById && req.user.role !== 'Admin') {
		return res.status(666).send('User is not authorized, only Chairs can do this');
	}
	next();
};