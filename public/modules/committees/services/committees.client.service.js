'use strict';

//Committees service used to communicate Committees REST endpoints
angular.module('committees').factory('Committees', ['$resource', 'Authentication',
	function($resource, Authentication) {
		return {
			Committees:	$resource('committees/:committeeId', { committeeId: '@_id'}, {update: {method: 'PUT'},query: {method: 'GET', isArray: true}}),
			Meetings: 	$resource('committees/:committeeId/meetings',{committeeId: '@_id'}), 
			Schedule: 	$resource('committees/:committeeId/:scheduleId',{committeeId: '@committeeId', scheduleId: '@scheduleId'}), 
			Members:    $resource('committees/:committeeId/members',{committeeId: '@_id'}),
			Member:     $resource('committees/:committeeId/:userId',{committeeId: '@committeeId', userId: '@userId'}, {update: {method: 'PUT'}}), 
			Chair:      $resource('committees/:committeeId/committeeChair/:chairId',{committeeId: '@committeeId', chairId:'@userId'}),

			userInCommittee: function(committee) {

				if(typeof committee !== 'undefined'){
					for(var i = 0; i < committee.members.length; i++){
						if(Authentication.user._id === committee.members[i]){
							return true;
						}
					}
					return false;
				}
				return false;

			},

			checkOwner: function(committee) {

				if(Authentication.user.displayName===committee.user.displayName){
					return true;
				}
				else{
					return false;
				}

			}
		};
	},

]);
