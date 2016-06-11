'use strict';

class RoomController {

  constructor($state, $scope, $rootScope, $uibModal, $log, roomService, roommateService, socket) {
    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$uibModal = $uibModal;
    this.$log = $log;
    this.socket = socket;
    this.roomService = roomService;
    this.roommateService = roommateService;

    this.roomId = null;
    this.roomName = '';
    this.roommates = [];

    this.$state.isAddingRoommates = false;
    this.$state.isAddingReminders = false;

    // TODO: Add sockets for syncing roommates
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('roommate');
    });
  }

  init() {
    this.$rootScope.nav.getCurrentUser(function(user) {
      return user;
    })
      .then(user => {
        this.currentUser = user;
        var opts = {
          userId: this.currentUser._id
        };
        this.roomService.getRooms( opts )
          .then(rooms => {
            // get first room in rooms array
            this.roomId = rooms.data[0]._id;
            this.roomName = rooms.data[0].name;
            this.roommates = rooms.data[0].roommates;
            this.socket.syncUpdates('roommate', this.roommates);
          });
          // .then(roommates => {
          //   for (var rm in roommates) {
          //     this.$log.log(roommates[rm]);
          //     this.$http.get('/api/roommates/')
          //   }
          // });
      });
  }

  addRoommate(addedRoommate) {
    // create roommate and add to room
    var roommate = addedRoommate;
    this.roommateService.createRoommate({
      _roomId: this.roomId,
      name: roommate.name,
      phone: parseInt(roommate.phone)
    })
      .then(response => {
        var roommateId = response.data._id;

        var opts = {
          roomId: this.roomId,
          roommateId: roommateId
        };
        this.roomService.addRoommate( opts );
      });
  }

  addReminder() {

  }

  openRoommateModal() {
    this.$state.isAddingRoommates = true;

    var self = this;
    this.$uibModal
      .open({
        animation: true,
        backdrop: false,
        templateUrl: 'components/modals/roommateModal/addRoommateModal.html',
        controller: 'RoommateModalController',
        controllerAs: 'roommateModalCtrl',
        keyboard: true,
        size: 'sm'
      })
      .result
      .then(function(addedRoommate) {
        // modal should have validated in front end
        self.addRoommate(addedRoommate);
      }, function() {
        self.$log.info('modal dismissed');
      });

  }

  openReminderModal() {

    this.$state.isAddingReminders = true;

    this.$uibModal.open({
      animation: true,
      templateUrl: 'components/modals/reminderModal/addReminderModal.html',
      controller: 'ReminderModalController',
      size: 'sm'
    });


  }

}

angular.module('higginsApp')
  .controller('RoomController', RoomController);
