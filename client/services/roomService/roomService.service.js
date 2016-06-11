'use strict';

angular.module('higginsApp.roomService', [])
  .factory('roomService', function ($http) {

    var getRooms = function( opts ) {
      var userId = opts.userId;
      return $http.get('/api/rooms/' + userId + '/rooms');
    };

    var createRoom = function( form ) {
      return $http.post('/api/rooms', form);
    };

    var updateRoom = function( opts, form ) {
      var roomId = opts.roomId;
      return $http.put('/api/rooms/' + roomId, form);
    };

    var addRoommate = function( opts ) {
      var roomId = opts.roomId;
      var roommateId = opts.roommateId;
      return $http.put('/api/rooms/' + roomId + '/add-roommate/' + roommateId);
    };

    // Public API here
    return {
      createRoom: createRoom,
      updateRoom: updateRoom,
      getRooms: getRooms,
      addRoommate: addRoommate

    };
  });
