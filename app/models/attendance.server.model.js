'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Attendance Schema
 */
var AttendanceSchema = new Schema({
	membersPresent:[String],
	members:[String],
	dateOfMeeting: {
		type: Date,
		default: Date.now
	},
	meeting:{
		type: Schema.ObjectId,
		ref: 'Meeting'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Attendance', AttendanceSchema);