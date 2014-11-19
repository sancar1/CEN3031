'use strict';
/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	//UserModel = require('./../models/article.server.model.js'),
	User = mongoose.model('User');


/**
 * Globals
 */
var user;
/**
 * Unit tests
 */

describe('Front End View Test', function(){

	var assert = require('assert'),
    http = require('http');

	describe('MAIN PAGE', function () {
	    it('should connect to localhost', function (done) {
	        http.get('http://localhost:3000/#!/', function (res) {
	            done();
	        });
	    });
	});

	describe('COMMITTEE PAGE', function () {
	    it('should connect to localhost', function (done) {
	        http.get('http://localhost:3000/committees/', function (res) {
	            done();
	        });
	    });
	});

	describe('EDIT COMMITTEE PAGE', function () {
	    it('should connect to localhost', function (done) {
	        http.get('http://localhost:3000/committees/edit', function (res) {
	            done();
	        });
	    });
	});

	describe('MEETING PAGE', function () {
	    it('should connect to localhost', function (done) {
	        http.get('http://localhost:3000/committees/meetings', function (res) {
	            done();
	        });
	    });
	});


	afterEach(function (done) {
	        /* ._id.$oid
	        Event.remove({ _id: myEvent.id }, function (err) {
	            if (!err) {
	                done();
	            }
	            else {
	                console.log('error with afterEach');
	            }
	        });*/
	        done();
	    });
});