'use strict';

class RoomController {

  constructor($state, $scope, $rootScope, $uibModal, $log, roomService, roommateService, reminderService, socket) {
    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$uibModal = $uibModal;
    this.$log = $log;
    this.socket = socket;

    this.roomService = roomService;
    this.roommateService = roommateService;
    this.reminderService = reminderService;

    this.roomId = null;
    this.roomName = '';
    this.roommates = [];
    this.reminders = [];

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('roommate');
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('reminder');
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
            this.roomService.populateRoommates({ roomId: roomId })
              .then(response => {
                this.roommates = response.data.roommates;
                this.socket.syncUpdates('roommate', this.roommates);
              });

            this.roomService.populateReminders({ roomId: roomId })
              .then(response => {
                this.reminders = response.data.reminders;
                this.socket.syncUpdates('reminder', this.reminders);
              })
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
          if (this.roommates[rm].phone == phone) {
            roommateIdArray.push(this.roommates[rm]._id);
          }
        }
      }
    }
    return roommateIdArray;
  }

  addReminder(reminder) {
    this.reminderService.createReminder({
      name: reminder.name,
      assignees: this.getRoommateIds(reminder.assignees),
      datetime: reminder.dateTime,
      doesRecur: reminder.doesRecur,
      recurType: reminder.recurType,
      active: true
    }).then(response => {
      this.roomService.updateRoom({roomId: this.roomId}, {
        reminders: [response.data._id]
      });
    });
  }

  deleteReminder(reminder) {
    this.reminderService.deleteReminder({reminderId: reminder._id});

    // TODO: Also need to delete reminder from all rooms
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

}

angular.module('higginsApp')
  .controller('RoomController', RoomController);
