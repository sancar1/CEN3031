'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Schedule = mongoose.model('Schedule');

/**
 * Globals
 */
var user, schedule;

/**
 * Unit tests
 */
describe('Schedule Model Unit Tests:', function() {
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
			schedule = new Schedule({
				name: 'Schedule Name',
				user: user
			});
			
			schedule = new Schedule({
				name: 'TestSchedule',
				events: [
					{title:'Event1',start: new Date(2014,10,11),end: new Date(2014,10,12),allDay: false, meeting: '12345'}
				]
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return schedule.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			schedule.name = '';

			return schedule.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});
	
	describe('Method Put', function() {
		it('should be able to add new events', function(done) {
			schedule.events.push({title:'Event2',start: new Date(2014,10,11),end: new Date(2014,10,12),allDay: false, meeting: '12345'})
			return schedule.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		
		
		it('When adding events, must be through pushing object to array', function(done) {
			schedule.events = "fail";
			return schedule.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
	});
	
	describe('Method Find', function() {
		it('should be able to find schedule by name', function(done) {
			return Schedule.find(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Schedule.remove().exec();
		User.remove().exec();

		done();
	});
});