'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('committees').factory('Committees', ['$resource',
	function($resource) {
		return $resource('committees/:committeeId', {
			committeeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);