'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Agendaitem Schema
 */
var AgendaitemSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Agendaitem name',
		trim: true
	},
	owner: String,
	voteable: Boolean,
	votesYes: {
		type: Number,
		default: 0
	},
	votesNo: {
		type: Number,
		default: 0
	},
	votesAbstain: {
		type: Number,
		default: 0
	},
	meetings: [String],
	committee: String,
	status: {
		type: Number,
		default: 0
	},
	description: String
		
});

mongoose.model('Agendaitem', AgendaitemSchema);