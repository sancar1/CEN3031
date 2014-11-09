'use strict';

angular.module('core').service('Roles', ['Authentication', '$filter',
	function(Authentication, $filter) {

		var userRoles = {
			'admin' : false,
			'user' : false,
		};

		var func = {
			get : function() {

				if($filter('lowercase')(Authentication.user.role) === 'admin')
					userRoles.admin = true;
				if($filter('lowercase')(Authentication.user.role) === 'user')
					userRoles.user = true;

				return userRoles;

			}
		};

		return func;

	}
]);