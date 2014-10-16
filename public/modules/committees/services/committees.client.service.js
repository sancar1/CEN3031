'use strict';

//Committees service used to communicate Committees REST endpoints
angular.module('committees').factory('Committees', ['$resource',
	function($resource) {
		return {
			Committees:	$resource('committees/:committeeId', { committeeId: '@_id'}, {update: {method: 'PUT'},query: {method: 'GET', isArray: true}}),
			Members:    $resource('committees/:committeeId/members',{committeeId: '@_id'}),
			Member:     $resource('committees/:committeeId/:userId',{committeeId: '@_id', userId: '@_id'}, {update: {method: 'PUT'}}), 
		};
	},

]);
