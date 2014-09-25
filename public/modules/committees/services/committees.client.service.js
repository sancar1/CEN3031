'use strict';

//Committees service used to communicate Committees REST endpoints
angular.module('committees').factory('Committees', ['$resource',
	function($resource) {
		return $resource('committees/:committeeId', { committeeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);