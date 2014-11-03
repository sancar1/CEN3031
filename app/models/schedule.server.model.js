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
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	events:[
      {title: String,start: Date,end: Date,allDay: Boolean}
	]
});

//instance method
ScheduleSchema.methods.findByUser = function ( callback) {
	return this.model('Schedule').find({ user: this.user }, callback);
}

//static method
ScheduleSchema.statics.findByName = function (name, callback) {
	this.find({ name: new RegExp(name, 'i') }, callback);
}

mongoose.model('Schedule', ScheduleSchema);