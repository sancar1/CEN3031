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
	Private: Boolean,
	voteable: Boolean,
	votesYes: Number,
	votesNo: Number,
	votesAbstain: Number,
	meetings: [String],
	accept: Boolean
		
});

mongoose.model('Agendaitem', AgendaitemSchema);