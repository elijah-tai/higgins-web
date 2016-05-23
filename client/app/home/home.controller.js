'use strict';

class HomeController {

  constructor($http, $state, $rootScope) {
    this.$http = $http;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.inRoom = false;
    this.rooms = [];
  }

  $onInit() {
    this.$rootScope.nav.getCurrentUser(function(user) {
      return user;
    })
      .then(user => {
        this.$http.get('/api/users/' + user._id + '/rooms')
          .then(rooms => {
            console.log(rooms);
            this.rooms = rooms;
          })
      })

  }

  createRoom() {
    console.log( 'Room created: ' + this.roomName );
    if (!!this.roomName) {
      this.$http.post('/api/rooms', {
        name: this.roomName
      })
        .then(response => {
          var roomId = response.data._id;
          this.$rootScope.nav.getCurrentUser(function(user) {
            return user;
          })
            .then(user => {
              this.$http.post('/api/users/' + user._id + '/add-room/' + roomId);
              this.$state.go('room');
            });
        });
    }
  }

  deleteRoom(room) {
    this.$http.delete('/api/rooms' + room._id);
  }

  isInRoom() {
    return this.inRoom;
  }

  hasRooms() {
    if (this.rooms === []) {
      return false;
    } else {
      return true;
    }
  }

  showRoomNameInput() {
    this.inRoom = true;
  }

}

angular.module('higginsApp')
  .controller('HomeController', HomeController);
