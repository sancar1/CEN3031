'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Meeting Schema
 */
var MeetingSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Meeting name',
		trim: true
	},
	notes:{
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}, 
	noteTaker: {
		type: String,
		required: 'Please select a note taker'
	}
});

mongoose.model('Meeting', MeetingSchema);