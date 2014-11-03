'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Committee Schema
 */
var CommitteeSchema = new Schema({
	name: {
		type: String,
		trim: true,
		default: '',
		required: 'Name cannot be blank',
		validate: [validateLocalStrategyProperty, 'Please fill in Committee name']
	},
	description: {
		type: String,
		trim: true,
		default: ''
	},
	chair: {
		 type: String,
	},
	members:   [String],
	meetings: [String],
	schedules: [String],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
});

//instance method
CommitteeSchema.methods.findByUser = function ( callback) {
	return this.model('Commmittee').find({ user: this.user }, callback);
};

//static method
CommitteeSchema.statics.findByName = function (name, callback) {
	this.find({ name: new RegExp(name, 'i') }, callback);
};

mongoose.model('Committee', CommitteeSchema);