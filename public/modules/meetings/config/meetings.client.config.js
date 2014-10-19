'use strict';

// Configuring the Articles module
angular.module('meetings').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Meetings', 'meetings', 'dropdown', '/meetings(/create)?');
		Menus.addSubMenuItem('topbar', 'meetings', 'List Meetings', 'meetings');
		Menus.addSubMenuItem('topbar', 'meetings', 'New Meeting', 'meetings/create');
	}
]);