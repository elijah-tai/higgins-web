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

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('roommate');
    });
  }

  // NOTE: would it be possible to put this init into the constructor?
  init() {
    this.$rootScope.nav.getCurrentUser(function(user) {
      return user;
    })
      .then(user => {
        this.currentUser = user;
        var opts = {
          userId: this.currentUser._id
        };
        this.roomService.getRoomByUserId( opts )
          .then(response => {
            // get first room in rooms array
            this.roomId = response.data[0]._id;
            this.roomName = response.data[0].name;
            return this.roomId;
          })
          .then(roomId => {
            var opts = {
              roomId: roomId
            };
            this.roomService.populateRoommates( opts )
              .then(response => {
                this.roommates = response.data.roommates;
                console.log(this.roommates);
                this.socket.syncUpdates('roommate', this.roommates);
              });
          })
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

  deleteRoommate(roommate) {
    var opts = {
      roommateId: roommate._id
    };
    this.roommateService.deleteRoommate( opts );

    // TODO: Also need to delete them from all reminders
    // this.roomService.deleteRoommate( opts );
  }

  editRoommate(roommate) {
    this.$state.isEditingRoommates = true;

    var self = this;
    this.$uibModal
      .open({
        animation: true,
        backdrop: false,
        templateUrl: 'components/modals/roommateModal/editRoommateModal.html',
        controller: 'RoommateModalController',
        controllerAs: 'roommateModalCtrl',
        keyboard: true,
        size: 'sm',
        resolve: {
          roommate: function() {
            return roommate;
          }
        }
      })
      .result
      .then(function(editedRoommate) {
        var opts = {
          roommateId: editedRoommate._id
        };
        var form = {
          name: editedRoommate.name,
          phone: editedRoommate.phone
        };
        self.roommateService.editRoommate(opts, form);
        self.$state.isEditingRoommates = false;
      }, function() {
        self.$log.info('edit roommate modal dismissed');
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
        self.$state.isAddingRoommates = false;
      }, function() {
        self.$log.info('modal dismissed');
      });

  }

  openReminderModal() {

    this.$state.isAddingReminders = true;

    this.$uibModal.open({
      animation: true,
      backdrop: false,
      templateUrl: 'components/modals/reminderModal/addReminderModal.html',
      controller: 'ReminderModalController',
      controllerAs: 'reminderModalCtrl',
      keyboard: true,
      size: 'sm'
    });


  }

}

angular.module('higginsApp')
  .controller('RoomController', RoomController);
