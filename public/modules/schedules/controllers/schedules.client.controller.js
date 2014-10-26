'use strict';

// Schedules controller
angular.module('schedules').controller('SchedulesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Schedules',
	function($scope, $stateParams, $location, Authentication, Schedules ) {
		$scope.authentication = Authentication;


		// Create new Schedule
		$scope.create = function() {
			// Create new Schedule object
			var schedule = new Schedules.Schedules ({
				name: this.name
			});

			// Redirect after save
			schedule.$save(function(response) {
				$location.path('schedules/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

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

		// Find a list of Schedules
		$scope.find = function() {
			$scope.schedules = Schedules.Schedules.query();
		};

		// Find existing Schedule
		$scope.findOne = function() {
			$scope.schedule = Schedules.Schedules.get({ 
				scheduleId: $stateParams.scheduleId
			});
		};


    $scope.addEvent = function(index){
      var schedule = $scope.schedule;
      $scope.schedule.eventToAdd = schedule.events[index];
      Schedules.Event.put({scheduleId: schedule._id}).$promise.then(function(data) {
        // $log.debug(data);
        $scope.schedule = data;
      });
    };

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
    $scope.eventSources = [$scope.events];
  
	}
]);