'use strict';

// Schedules controller
angular.module('schedules').controller('SchedulesController', ['$scope', '$stateParams', '$location', 'Authentication','Committees', 'Schedules', '$log', '$timeout',
	function($scope, $stateParams, $location, Authentication,Committees, Schedules, $log, $timeout) {
		$scope.authentication = Authentication;


		// Remove existing Schedule
		$scope.remove = function( schedule ) {
			if ( schedule ) { schedule.$remove();

				for (var i in $scope.schedules ) {
					if ($scope.schedules [i] === schedule ) {
						$scope.schedules.splice(i, 1);
					}
				}
			} else {
				$scope.schedule.$remove(function() {
					$location.path('schedules');
				});
			}
		};

		// Update existing Schedule
		$scope.update = function() {
			var schedule = $scope.schedule ;

			schedule.$update(function() {
				$location.path('schedules/' + schedule._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

//     $scope.addNewEvent = function(){
//       var schedule = $scope.schedule;
//       // $scope.schedule.eventToAdd = schedule.events[index];

//       $log.debug('Entered addEvent');

//       var tempEventObject = {
//           'title' : $scope.newEvent.name,
//           'start' : new Date($scope.newEvent.startY,$scope.newEvent.startM-1,$scope.newEvent.startD),
//           'end'   : new Date($scope.newEvent.endY,$scope.newEvent.endM-1,$scope.newEvent.endD)
//       };

//       // var tempEventObject = {
// //           'title' : 'Crazy Event',
// //           'start' : new Date(2014,11,11),
// //           'end'   : new Date(2014,12,12),
// //           'allDay': false
// //       };
//       JSON.stringify(tempEventObject);
//       $scope.schedule.events.push(tempEventObject);
//       $scope.schedule.$update();
//       // $log.debug('tempEventObject:');
//       // $log.debug(tempEventObject);

//       // $scope.events.push(tempEventObject);

//       // $log.debug('Events Array:');
//       // $log.debug($scope.events);

//       // $log.debug('Schedule:');
//       // $log.debug($scope.schedule);     

//       // var index = $scope.events.length-1;
//       // $scope.eventToAdd = $scope.events[index];

//       // $log.debug('Event to Add:');
//       // $log.debug($scope.eventToAdd);

//       // $log.debug('Schedule id:');
//       // $log.debug(schedule._id);

//       // Schedules.Event.update({scheduleId: schedule._id}).$promise.then(function(data) {
//       //   $log.debug('Data from Sucessful Added Event:');
//       //   $log.debug(data);
//       //   $scope.schedule = data;
//       // });
//     };

      $scope.removeEvent = function(index){
      var schedule = $scope.schedule;
      var eventToRemove = schedule.events[index];
      Schedules.Event.delete({scheduleId: schedule._id}).$promise.then(function(data) {
        // $log.debug(data);
        $scope.schedule = data;
      });
    };

      $scope.getEvents = function(){
      var schedule = $scope.schedule;
      Schedules.Event.query({scheduleId: schedule._id}).$promise.then(function(data) {
        // $log.debug(data);
        $scope.schedule = data;
      });
    };

		 var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    
    /* event source that contains custom events on the scope */
    $scope.events = [
      {title: 'All Day Event',start: new Date(y, m, 1)},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
      {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };

    $scope.calEventsExt = {
       color: '#f00',
       textColor: 'yellow',
       events: [ 
          {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( event, allDay, jsEvent, view ){
        $scope.alertMessage = (event.title + ' was clicked ');
		  console.log(event.title);
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + dayDelta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + minuteDelta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      calendar.fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      calendar.fullCalendar('render');
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };
    /* event sources array*/
    // $scope.eventSources = [];
  
	}
]);