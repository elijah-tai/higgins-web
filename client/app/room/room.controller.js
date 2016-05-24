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

  beginAddingRoomate() {
    this.$state.isAddingRoomMates = true;
  }
  
  addRoomMate() {
    
  }

}

angular.module('higginsApp')
  .controller('RoomController', RoomController);
