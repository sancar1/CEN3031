'use strict';

// Configuring the Articles module
angular.module('committees').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Committees', 'committees', 'dropdown', '/committees(/create)?');
		// Menus.addSubMenuItem('topbar', 'committees', 'List Committees', 'committees');
		Menus.addSubMenuItem('topbar', 'committees', 'New Committee', 'committees/create');
	}
]);