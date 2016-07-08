'use strict';

angular.module('higginsApp.userService', [])
  .factory('userService', function ($http) {

    var updateUserGroups = function( opts, form ) {
      var userId = opts.userId;
      return $http.post('/api/users/' + userId + '/add-group', form);
    };

    // Public API here
    return {
      updateUserGroups: updateUserGroups
    };
  });
