'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Attendance = mongoose.model('Attendance');

/**
 * Globals
 */
var user, attendance;

/**
 * Unit tests
 */

describe('Front End View Test', function(){

	var assert = require('assert'),
    http = require('http');

	describe('MAIN PAGE', function () {
	    it('should connect to localhost', function (done) {
	        http.get('http://localhost:3000', function (res) {
	            done();
	        });
	    });
	});
});

describe('Attendance Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			attendance = new Attendance({
				name: 'Attendance Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return attendance.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Attendance.remove().exec();
		User.remove().exec();

		done();
	});
});