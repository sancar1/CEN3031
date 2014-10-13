'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Committee = mongoose.model('Committee');

/**
 * Globals
 */
var user, user2, committee;

/**
 * Unit tests
 */
describe('Committee Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});
		user2 = new User({
			firstName: 'Full2',
			lastName: 'Name2',
			displayName: 'Full Name2',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});
		committee = new Committee({
				name: 'Committee Name', 
		});

		user.save(function() { 
			committee.user = user;
			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return committee.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			committee.name = '';

			return committee.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should be able to add member without problems', function(done){
			committee.members[0] = user2._Id;
			return committee.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Committee.remove().exec();
		User.remove().exec();

		done();
	});
});