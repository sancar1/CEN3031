'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Schedule Schema
 */
var ScheduleSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Schedule name',
		trim: true
	},
	events:[
      {start: Date,end: Date,allDay: Boolean, meeting: String}
	]
});

//instance method
ScheduleSchema.methods.findByUser = function ( callback) {
	return this.model('Schedule').find({ user: this.user }, callback);
};

//static method
ScheduleSchema.statics.findByName = function (name, callback) {
	this.find({ name: new RegExp(name, 'i') }, callback);
};

mongoose.model('Schedule', ScheduleSchema);