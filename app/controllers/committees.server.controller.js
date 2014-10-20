'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Committee = mongoose.model('Committee'),
	User = mongoose.model('User'),
	nodemailer = require('nodemailer'),
	async = require('async'),
	_ = require('lodash'),
	config = require('../../config/config');

/*
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth:{
		user: 'CACTUS.cen3031@gmail.com',
		pass: 'cen3031cactus'
	}
*/
// });


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
 * Delete a Committee
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
	
	User.find({'_id':{$in: committee.members}}).exec(function(err, members) {
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
 * List of Meetings
 */
exports.getMeetings = function(req, res){
	var committee = req.committee;

	User.find({'_id':{$in: committee.meetings}}).exec(function(err, meetings) {
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
 * Add Committee Member
 */
exports.addMember = function(req, res) {
	var userById = req.params.userId;
	var committeeById = req.committee._id; 

	async.waterfall([
		function(done){
			Committee.update({'_id': committeeById}, {$addToSet:{'members': userById}},function(err, committee){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else done(err,committee);
			});
			
		},
		function(committee, done){
			User.find({'_id': userById},function(err, user){
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
				if (err) console.log('message not sent: '+ console.log(err));
				else console.log('message sent: '+ console.log(info));
				done(err);
			});
		}
		],function(err){
			if(err) console.log(err);
		});
};

/**
 * Remove Committee Member
 */
exports.removeMember = function(req, res) { 
	var userById = req.params.userId;
	var committeeById = req.committee._id;
	var memberById = req.params.userId;

	console.log(committeeById);
	console.log(memberById);

	async.waterfall([
		function(done){
			Committee.update({'_id':committeeById},{$pull:{'members': memberById}}).exec(function(err, committee) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else done(err,committee);
			});
			
		},
		function(committee, done){
			User.find({'_id': userById},function(err, user){
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
			res.render('templates/remove-from-committee', {
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
				subject: 'Removed from a committee',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function(err, info) {
				if (err) console.log('message not sent: '+ console.log(err));
				else console.log('message sent: '+ console.log(info));
				done(err);
			});
		}
		],function(err){
			if(err) console.log(err);

	});
};

/**
 * Get Committee Chair
 */
exports.getChair = function(req, res) { 
	var chairById = req.committee.chair;
	User.find({'_id': chairById}).exec(function(err, chair) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chair[0]);
		}
	});
};

/**
 * Change Committee Chair
 */
exports.setChair = function(req, res) { 
	var committeeById = req.committee._id;
	var chairById = req.params.userId;

	console.log(committeeById);
	console.log(chairById);

	Committee.update({'_id':committeeById},{'chair': chairById}).exec(function(err, committee) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(committee[0]);
		}
	});
};


/**
 * Remove Committee Chair
 */
exports.removeChair = function(req, res) { 
	var committeeById = req.committee._id;

	console.log(committeeById);
	//console.log(chairById);

	Committee.update({'_id':committeeById},{'chair': ''}).exec(function(err, committee) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(committee[0]);
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