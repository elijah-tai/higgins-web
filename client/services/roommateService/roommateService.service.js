'use strict';

angular.module('higginsApp.roommateService', [])
  .factory('roommateService', function ($http) {

    var getRoommate = function( opts ) {
      return $http.get('/api/roommates/' + opts.roommateId);
    };
    
    var createRoommate = function( form ) {
      return $http.post('/api/roommates', form );
    };

    // Public API here
    return {
      getRoommate: getRoommate,
      createRoommate: createRoommate
    };
  });
