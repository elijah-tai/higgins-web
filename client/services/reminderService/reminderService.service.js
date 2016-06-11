'use strict';

angular.module('higginsApp.reminderService', [])
  .factory('reminderService', function ($http) {

    var createReminder = function( form ) {
      return $http.post( '/api/reminders', form );
    };

    // Public API here
    return {
      createReminder: createReminder
    };
  });
