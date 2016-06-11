'use strict';

angular.module('higginsApp.roommateService', [])
  .factory('roommateService', function ($http) {

    var createRoommate = function( form ) {
      return $http.post('/api/roommates', form );
    };

    // Public API here
    return {
      createRoommate: createRoommate
    };
  });
