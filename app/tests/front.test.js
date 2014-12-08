'use strict';
/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	UserModel = require('./../models/user.server.model.js'),
	User = mongoose.model('User');


/**
 * Globals
 */
var  user;
/**
 * Unit tests
 */

describe('Front End View Test', function(){

	var assert = require('assert'),
    http = require('http');

	describe('Home page view', function () {
	    it('should connect to localhost', function (done) {
	        http.get('http://localhost:3000/', function (res) {
	            done();
	        });
	    });
	});

	describe('Creat committee view', function () {
	    it('should connect to localhost', function (done) {
	        http.get('http://localhost:3000/#!/committees/create', function (res) {
	            done();
	        });
	    });
	});

	describe('Edit profile view', function () {
	    it('should connect to localhost', function (done) {
	        http.get('http://localhost:3000/#!/settings/profile', function (res) {
	            done();
	        });
	    });
	});

	describe('User Contact view', function () {
	    it('should connect to localhost', function (done) {
	        http.get('http://localhost:3000/#!/settings/list', function (res) {
	            done();
	        });
	    });
	});


	afterEach(function (done) {
	      
	        done();
	    });
});