'use strict';

class HomeController {

  constructor($http, $state, $rootScope, $scope) {
    this.$http = $http;
    this.$state = $state;
    this.$state.isCreatingRoom = false;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.currentUser = null;
    this.roomName = '';
    this.rooms = [];
  }

  init() {
    this.$rootScope.nav.getCurrentUser(function(user) {
      return user;
    })
      .then(user => {
        this.currentUser = user;
        this.$http.get('/api/rooms/' + user._id + '/rooms')
          .then(rooms => {
            this.rooms = rooms.data;
          });
      });
  }

  createRoom() {
    if (!!this.roomName && !!this.currentUser) {
      this.$http.post('/api/rooms', {
        _creator: this.currentUser._id,
        name: this.roomName
      })
        .then(response => {
          var roomId = response.data._id;
          this.$rootScope.nav.getCurrentUser(function(user) {
            return user;
          })
            .then(user => {
              this.$http.post('/api/users/' + user._id + '/add-room/' + roomId);
              this.$state.isCreatingRoom = false;
              this.$state.go('room');
            });
        });
    }
  }

  deleteRoom(room) {
    // TODO: should show confirmation modal
    this.$http.delete('/api/rooms/' + room._id);
  }

  hasRooms() {
    console.log(this.rooms);
    if (this.rooms === []) {
      return false;
    } else {
      return true;
    }
  }

  showRoomNameInput() {
    this.$state.isCreatingRoom = true;
  }

}

angular.module('higginsApp')
  .controller('HomeController', HomeController);
