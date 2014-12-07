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
		required: 'Please fill meeting name',
		trim: true
	},
	notes:{
		type: String,
		default: '',
		trim: true
	},
	members:[{
		displayName: String,
		userId: String,
		isPresent: Boolean
	}],
	agendaItems:[{
		name: String,
		owner:String,
		_id: String,
		resolved: Boolean
	}],
	committeeId: String,
	membersPresent: Number,
	noteTaker: {
	type: String,
	default:'',
	required: 'Please select a note taker'
	}
});

//instance method
MeetingSchema.methods.findByUser = function ( callback) {
	return this.model('Meeting').find({ user: this.user }, callback);
};

//static method
MeetingSchema.statics.findByName = function (name, callback) {
	this.find({ name: new RegExp(name, 'i') }, callback);
};

mongoose.model('Meeting', MeetingSchema);