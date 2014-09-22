'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Committee = mongoose.model('Committee'),
	User = mongoose.model('User');

/**
 * Globals
 */
var committee, committee2, user, user2;

/**
 * Unit tests
 */
describe('Committee Model Unit Tests:', function() {
	before(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'user1@test.com',
			office: 'office1',
			phoneNum: 'phoneNum1',
			username: 'username',
			role: 'member',
			password: 'password',
			provider: 'local'
		});
		user2 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'user2@test.com',
			office: 'office2',
			phoneNum: 'phoneNum2',
			username: 'username',
			role: 'member',
			password: 'password',
			provider: 'local'
		});

		committee = new Committee({
			committeeName: 'committee1',
			committeeDescription: 'description1',
			committeeChair: user,
			committeeMembers: [user, user2],
		});

		done();
	});

	describe('Method Save', function() {
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without first name', function(done) {
			user.firstName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});