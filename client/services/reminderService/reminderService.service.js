'use strict';

angular.module('higginsApp.reminderService', [])
  .factory('reminderService', function ($http) {

    var createReminder = function( form ) {
      return $http.post( '/api/reminders', form );
    };

    var deleteReminder = function( opts ) {
      return $http.delete('/api/reminders/' + opts.reminderId);
    };

    var editReminder = function( opts, form ) {
      return $http.put('/api/reminder/' + opts.reminderId, form);
    };

    // Public API here
    return {
      createReminder: createReminder,
      deleteReminder: deleteReminder,
      editReminder: editReminder
    };
  });
