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
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var CommitteeSchema = new Schema({
	committeeName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in Comittee Name']
	},
	committeeDescription: {
		type: String,
		trim: true,
		default: ''
	},
	CommitteeChair: {
		 user: {
		 	type: Schema.ObjectId, 
		 	ref: 'UserSchema'
		},
	},
	members: [
		{
			user: {
				type: Schema.ObjectId, 
				ref: 'UserSchema'
			}
		}
	],
	 
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
});

mongoose.model('Committee', CommitteeSchema);