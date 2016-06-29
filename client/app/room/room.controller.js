'use strict';

class RoomController {

  constructor($state, $stateParams, $scope, $rootScope, $uibModal, $log, roomService,
              roommateService, reminderService, alertService, socket) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    // TODO: How can we access the deleteRoom() function from parent?
    this.$rootScope.deleteRoom = this.deleteRoom;

    this.$uibModal = $uibModal;
    this.$log = $log;
    this.socket = socket;

    this.editingRoomName = false;

    this.roomService = roomService;
    this.roommateService = roommateService;
    this.reminderService = reminderService;
    this.alertService = alertService;

    this.roomId = null;
    this.roomName = '';
    this.roommates = [];
    this.reminders = [];

    this.focusInput = {
      'roomName': false
    };

    $scope.$on('$destroy', () => {
      socket.unsyncUpdates('roommate');
    });

    $scope.$on('$destroy', () => {
      socket.unsyncUpdates('reminder');
    });

  }

  // NOTE: would it be possible to put this init into the constructor?
  init() {
    this.$rootScope.nav.getCurrentUser(function(user) {
      return user;
    }).then(user => {
        this.currentUser = user;
    });

    this.roomService.getRoom({ roomId: this.$stateParams.roomId })
      .then(response => {
        this.roomId = response.data._id;
        this.roomName = response.data.name;
        return this.roomId;
      })
      .then(roomId => {
        this.roomService.populateRoommates({ roomId: roomId })
          .then(response => {
            this.roommates = response.data.roommates;
            this.socket.syncUpdates('roommate', this.roommates);
          });

        this.roomService.populateReminders({ roomId: roomId })
          .then(response => {
            this.reminders = response.data.reminders;
            this.socket.syncUpdates('reminder', this.reminders);
          });
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
    // this.roomService.deleteRoommate( opts ); --> query reminders for roommates, then delete
  }

  editRoommate(roommate) {
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
      }, function() {
        self.$log.info('edit roommate modal dismissed');
      });
  }

  openAddRoommateModal() {
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

  /* jshint loopfunc:true */
  getRoommateIds(assignees) {
    var roommateIdArray = [];
    for (var phone in assignees) {
      if (assignees[phone] === true) {
        for (var rm in this.roommates) {
          console.log(rm);
          if (this.roommates[rm].phone === parseInt(phone)) {
            roommateIdArray.push(this.roommates[rm]._id);
          }
        }
      }
    }

    return roommateIdArray;
  }

  addReminder(reminder) {
    console.log(reminder.assignees);
    this.reminderService.createReminder({
      name: reminder.name,
      assignees: this.getRoommateIds(reminder.assignees),
      datetime: reminder.datetime,
      doesRecur: reminder.doesRecur,
      recurType: reminder.recurType,
      active: true
    }).then(response => {
      this.roomService.addReminder({
        roomId: this.roomId,
        reminderId: response.data._id
      });
    });
  }

  deleteReminder(reminder) {
    this.reminderService.deleteReminder({reminderId: reminder._id});
  }

  openAddReminderModal() {
    var self = this;
    this.$uibModal.open({
      animation: true,
      backdrop: false,
      templateUrl: 'components/modals/reminderModal/addReminderModal.html',
      controller: 'ReminderModalController',
      controllerAs: 'reminderModalCtrl',
      keyboard: true,
      size: 'md',
      resolve: {
        roommates: function() {
          return self.roommates;
        }
      }
    })
      .result
      .then(function(addedReminder) {
        self.addReminder(addedReminder);
      }, function() {
        self.$log.info('add reminder modal dismissed');
      });
  }

  editRoomName() {
    if (this.roomName === '') {
      this.alertService.showFormAlert('roomName');
      this.editingRoomName = true;
    } else {
      this.editingRoomName = false;
      this.roomService.updateRoom({ roomId: this.roomId }, { name: this.roomName });
    }
  }

  deleteRoom() {
    var self = this;
    this.$uibModal.open({
      animation: true,
      backdrop: false,
      templateUrl: 'components/modals/roomModal/confirmDeleteRoomModal.html',
      controller: 'RoomModalController',
      controllerAs: 'roomModalCtrl',
      keyboard: true,
      size: 'sm',
      resolve: {
        roomId: function() {
          return self.roomId;
        }
      }
    })
      .result
      .then(function(deletedRoomId) {
        self.roomService.deleteRoom({ roomId: deletedRoomId })
          .then(() => {
            self.$state.go('dashboard');
          });
      }, function() {
        self.$log.info('delete room modal dismissed');
      });
  }

}

angular.module('higginsApp')
  .controller('RoomController', RoomController);
