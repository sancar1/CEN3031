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

//SMTP Transport for emailing people.  
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
 * Create a Committee
 */
exports.create = function(req, res) {
	var pass = req.committee;
	var committee = new Committee(req.body);
	var chair;
	committee.user = req.user;
	console.log('here to create');
//Waterfall to gaurantee execution order.  
	async.waterfall([
		//Save the committee, package into JSON and attempt to return it after waterfall has completed.
		function(done){
			committee.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else done(null,committee);
			});
		},
		//Find the user info corresponding to chair.  For emailing purposes
		function(committee, done){
			User.find({'_id': req.body.chair},function(err, user){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else{
					chair = user[0];
					done(null,chair);
				}
			});
		},
		//Build the email template
		function(chair, done) {
			res.render('templates/add-as-chair', {
				name: chair.displayName,
				committee: req.body.name,
				appName: config.app.title
			}, function(err, emailHTML) {
				done(err, emailHTML, chair);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, chair, done) {
			var mailOptions = {
				to: chair.email,
				from: config.mailer.from,
				subject: 'Added as chair of a committee',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function(err, info) {
				if (err) console.log('message not sent: ' + console.log(err));
				else console.log('message sent: ' + console.log(info));
				done(err);
			});
			res.jsonp(committee);
		}
		],function(err){
			if(err) console.log(err);
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
		}
		else res.jsonp(committee);
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
		} 
		else res.jsonp(committee);
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
		} 
		else res.jsonp(committees);
	});
};
/*
 * Add Committee Meeting
 */
exports.addSchedule = function(req, res) {
	var scheduleById = req.params.scheduleId;
	var committeeById = req.committee._id; 
	console.log('here');
	async.waterfall([
		function(done){
			Committee.update({'_id': committeeById}, {$addToSet:{'schedules': scheduleById}},function(err, committee){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else done(err,committee[0]);
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
 * List of Committee Members
 */
exports.getMembers = function(req, res) { 
	var committee = req.committee;
	User.find({'_id':{$in: committee.members}}).sort('lastName').exec(function(err, members) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} 
		else res.jsonp(members);
	});
};
/**
 * Add Committee Member
 */
exports.addMember = function(req, res) {
	var userById = req.params.userId;
	var committeeById = req.committee._id; 

	async.waterfall([
		//Add ther person to the list if they are not already a part of it
		function(done){
			//addToSet blocks addition of multiple elements of the same value
			Committee.update({'_id': committeeById}, {$addToSet:{'members': userById}},function(err, committee){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else done(null,committee);
			});
		},
		//Get the info of the user just added for emailing purposes
		function(committee, done){
			User.find({'_id': userById},function(err, user){
				if(err){
					return res.status(401).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else done(null,user[0]);
			});
		},
		//Build email template
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
			res.jsonp(user);
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
			var mailOptions = {
				to: user.email,
				from: config.mailer.from,
				subject: 'Removed from a committee',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function(err, info) {
				if (err) console.log('message not sent: ' + console.log(err));
				else console.log('message sent: ' + console.log(info));
				done(err);
			});
			res.jsonp(user);
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
		} 
		else res.jsonp(chair[0]);	
	});
};

/**
 * Change Committee Chair
 */
exports.setChair = function(req, res) { 
	var committeeById = req.committee._id;
	var chairById = req.params.userId;
	async.waterfall([
		function(done){
			Committee.update({'_id':committeeById},{'chair': chairById}).exec(function(err, committee) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(committee[0]);
				}
			});
		},
		function(committee, done){
			User.find({'_id': chairById},function(err, user){
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
				committee: req.committee.name,
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
			res.jsonp(user);
		}
		],function(err){
			if(err) console.log(err);
	});
};


/**
 * Remove Committee Chair
 */
exports.removeChair = function(req, res) { 
	var userById = req.params.userId;
	var committeeById = req.committee._id;
	async.waterfall([
		function(done){
			Committee.update({'_id':committeeById},{'chair': ''}).exec(function(err, committee) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(committee[0]);
				}
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
			res.render('templates/remove-as-chair', {
				name: user.displayName,
				committee: req.committee.name,
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
				subject: 'Removed as chair from a committee',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function(err, info) {
				if (err) console.log('message not sent: ' + console.log(err));
				else console.log('message sent: ' + console.log(info));
				done(err);
			});
			res.jsonp(user);
		}
		],function(err){
			if(err) console.log(err);

	});
};

/**
 * Committee middleware
 */
exports.committeeByID = function(req, res, next, id) { Committee.findById(id).exec(function(err, committee) {
		if (err){
			return next(err);
		}
		if (! committee) return next(new Error('Failed to load Committee ' + id));
		req.committee = committee ;
		next();
	});
};
/**
 * Committee authorization middleware, are you an admin?
 */
exports.isAdmin = function(req, res, next) {
	if (req.user.role !== 'Admin') {
		return res.status(666).send('User is not authorized, only Admins can do this');
	}
	next();
};
/**
 * Committee authorization middleware, are you a chair?
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
	var chairById = req.committee.chair;
	var userById = req.user._id.toString();
	if (chairById !== userById && req.user.role !== 'Admin') {
		return res.status(666).send('User is not authorized, only Chairs can do this');
	}
	next();
};