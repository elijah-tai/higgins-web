'use strict';

angular.module('higginsApp.userService', [])
  .factory('userService', function ($http) {

    var updateUserRooms = function( opts, form ) {
      var userId = opts.userId;
      return $http.post('/api/users/' + userId + '/add-room', form);
    };

    // Public API here
    return {
      updateUserRooms: updateUserRooms
    };
  });
