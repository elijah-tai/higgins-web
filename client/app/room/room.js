'use strict';

angular.module('higginsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('room', {
        url: '/room',
        templateUrl: 'app/room/room.html',
        authenticate: true,
        controller: 'RoomController',
        controllerAs: 'roomCtrl'
      });
  });
