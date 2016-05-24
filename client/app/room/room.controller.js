'use strict';

class RoomController {

  constructor($http, $state, $rootScope) {
    this.$http = $http;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.roomMates = [];
    this.$state.isAddingRoomMates = false;
  }

  init() {
    this.roomMates = this.$rootScope.currentRoom.roomMates;
  }

  addRoomMate() {
    console.log('Add roommate');
    this.$state.isAddingRoomMates = true;



  }


}

angular.module('higginsApp')
  .controller('RoomController', RoomController);
