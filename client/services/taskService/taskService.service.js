'use strict';

angular.module('higginsApp.taskService', [])
  .factory('taskService', function ($http) {

    var createTask = function( form ) {
      return $http.post( '/api/tasks', form );
    };

    var deleteTask = function( opts ) {
      return $http.delete('/api/tasks/' + opts.taskId);
    };

    var editTask = function( opts, form ) {
      return $http.put('/api/tasks/' + opts.taskId, form);
    };

    // Public API here
    return {
      createTask: createTask,
      deleteTask: deleteTask,
      editTask: editTask
    };
  });
