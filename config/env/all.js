'use strict';

module.exports = {
	app: {
		title: 'CACTUS Committee Manager - Development Environment',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'mongodb, express, angularjs, node.js, mongoose, passport'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/fullcalendar/dist/fullcalendar.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js',
				'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/jquery-ui.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/jquery/dist/jquery.js',
				'public/lib/jquery-ui/ui/jquery-ui.js',
				'public/lib/moment/moment.js',
				'public/lib/fullcalendar/dist/fullcalendar.js',
				'public/lib/angular-ui-calendar/src/calendar.js',
				'public/lib/tinymce/js/tinymce/tinymce.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};