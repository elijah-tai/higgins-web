'use strict';

class RoomController {

  constructor($http, $state, $scope, $rootScope, $uibModal, $log) {
    this.$http = $http;
    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$uibModal = $uibModal;
    this.$log = $log;
    // this.socket = socket;

    this.roomId = null;
    this.roomName = '';
    this.roommates = [];

    this.$state.isAddingRoommates = false;
    this.$state.isAddingReminders = false;

    // TODO: Add sockets for syncing roommates
    // $scope.$on('$destroy', function() {
    //   socket.unsyncUpdates('roommate');
    // });
  }

  init() {
    this.$rootScope.nav.getCurrentUser(function(user) {
      return user;
    })
      .then(user => {
        this.currentUser = user;
        this.$http.get('/api/rooms/' + user._id + '/rooms')
          .then(rooms => {
            // get first room in rooms array
            this.roomId = rooms.data[0]._id;
            this.roomName = rooms.data[0].name;
            this.roommates = rooms.data[0].roommates;

            // TODO: Add socket for syncing roommates
            // this.socket.syncUpdates('roommate', this.roommates);
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
    this.$http.post('/api/roommates', {
      _roomId: this.roomId,
      name: roommate.name,
      phone: parseInt(roommate.phone)
    })
      .then(response => {
        var roommateId = response.data._id;
        this.$http.put('/api/rooms/' + this.roomId + '/add-roommate/' + roommateId);
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
