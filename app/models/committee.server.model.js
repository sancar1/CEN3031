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
		validate: [validateLocalStrategyProperty, 'Please fill in Committee Name']
	},
	description: {
		type: String,
		trim: true,
		default: ''
	},
	chair: {
		 user: {
		 	type: Schema.ObjectId, 
		 	ref: 'UserSchema'
		},
	},
	members: [
		{
			user: {
				type: Schema.ObjectId, 
				ref: 'User'
			}
		}
	],
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

mongoose.model('Committee', CommitteeSchema);