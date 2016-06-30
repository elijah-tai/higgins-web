'use strict';

class DashboardController {

  constructor($state, $rootScope, $scope, roomService, roommateService, userService, socket) {
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$rootScope.currentRoom = null;
    this.$scope = $scope;

    this.roomService = roomService;
    this.roommateService = roommateService;
    this.userService = userService;
    this.socket = socket;

    this.currentUser = null;
    this.roomName = '';
    this.hasRooms = false;
    this.rooms = [];
    this.isCreatingRoom = false;

    $scope.$on('$destroy', () => {
      socket.unsyncUpdates('room');
    });
  }

  init() {
    this.$rootScope.nav.getCurrentUser(function(user) {
      return user;
    })
      .then(user => {
        this.currentUser = user;
        this.roomService.getRoomsByUserId({ userId: user._id })
          .then(rooms => {
            this.rooms = rooms.data;
            this.socket.syncUpdates('room', this.rooms);

            if (typeof this.rooms !== 'undefined' && this.rooms.length > 0) {
              this.hasRooms = true;
            }
          });
      });
  }

  goToRoom(room) {
    this.$rootScope.currentRoom = room;
    this.$state.go('room', { roomId: room._id });
  }

  createRoom() {
    if (!!this.roomName && !!this.currentUser) {
      this.roomService.createRoom({
        _creator: this.currentUser._id,
        name: this.roomName
      })
        .then(response => {
          var roomId = response.data._id;
          this.$rootScope.currentRoom = response.data;
          this.$rootScope.nav.getCurrentUser(function(user) {
            return user;
          })
            .then(user => {
              this.userService.updateUserRooms({ userId: user._id }, { roomId: roomId })
                .then(() => {
                  this.roommateService.createRoommate({
                    _roomId: roomId,
                    name: user.name,
                    phone: user.phone
                  })
                    .then((response) => {
                      var roommateId = response.data._id;
                      this.roomService.addRoommate({ roomId: roomId, roommateId: roommateId });
                    });
                  this.isCreatingRoom = false;
                  this.checkHasRooms();
                });
            });
        });
    }
  }

  deleteRoom(room) {
    // TODO: should show confirmation modal
    this.roomService.deleteRoom({ roomId: room._id })
      .then(() => {
        this.checkHasRooms();
      });
  }

  checkHasRooms() {
    if (typeof this.rooms !== 'undefined' && this.rooms.length > 0) {
      this.hasRooms = true;
    } else {
      this.hasRooms = false;
    }
  }

  showRoomNameInput() {
    this.isCreatingRoom = true;
  }

}

angular.module('higginsApp')
  .controller('DashboardController', DashboardController);
