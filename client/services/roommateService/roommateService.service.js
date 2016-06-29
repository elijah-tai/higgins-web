'use strict';

angular.module('higginsApp.roommateService', [])
  .factory('roommateService', function ($http) {

    var getRoommate = function( opts ) {
      return $http.get('/api/roommates/' + opts.roommateId);
    };

    var createRoommate = function( form ) {
      return $http.post('/api/roommates', form);
    };

    var deleteRoommate = function( opts ) {
      return $http.delete('/api/roommates/' + opts.roommateId);
    };

    var editRoommate = function( opts, form ) {
      return $http.put('/api/roommates/' + opts.roommateId, form);
    };

    // Public API here
    return {
      getRoommate: getRoommate,
      createRoommate: createRoommate,
      deleteRoommate: deleteRoommate,
      editRoommate: editRoommate
    };
  });
