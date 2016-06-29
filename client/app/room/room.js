'use strict';

angular.module('higginsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('room', {
        url: '/room/:roomId',
        templateUrl: 'app/room/room.html',
        authenticate: true,
        controller: 'RoomController',
        controllerAs: 'roomCtrl'
      });
  });
