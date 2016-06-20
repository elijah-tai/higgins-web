'use strict';

// optional: room address
// required: room name,
//           at least 1 room mate,
//           at least 1 reminder

class OnboardingController {

  constructor($scope, $rootScope, $q, $state, $window, roomService, userService, roommateService, reminderService) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$q = $q;
    this.$state = $state;
    this.$window = $window;

    this.roomService = roomService;
    this.userService = userService;
    this.roommateService = roommateService;
    this.reminderService = reminderService;

    this.currentUser = null;

    this.formAlerts = [];
    this.showAlert = false;

    this.reminderDateTimePickerOpen = false;

    this.onboardingData = {
      roommates: [],
      reminders: [],
      reminderDateTime: new Date(),
      reminderRecursType: 'Select One',
      reminderDoesRecur: false
    };

  }

  init() {
    this.$rootScope.nav.getCurrentUser((user) => {
      return user;
    })
      .then(user => {
        this.currentUser = user;
      });
  }

  addRoommate() {
    // TODO: validate roommate
    this.onboardingData.roommates.push({
      name: this.onboardingData.roommateName,
      phone: this.onboardingData.roommatePhone,
      _id: '' // mongoose.Types.ObjectId
    });

    this.onboardingData.roommateName = '';
    this.onboardingData.roommatePhone = '';
  }

  openReminderDateTimePicker(e) {
    e.preventDefault();
    e.stopPropagation();

    this.reminderDateTimePickerOpen = true;
  }

  addReminder() {
    // TODO: validate reminder
    var assignees = angular.copy(this.onboardingData.selectedRoommates);
    this.onboardingData.reminders.push({
      name: this.onboardingData.reminderName,
      assignees: assignees, // ng-model = {}
      datetime: this.onboardingData.reminderDateTime,
      recurType: this.onboardingData.reminderRecursType,
      doesRecur: this.onboardingData.reminderDoesRecur,
      active: true,
      _id: ''
    });
  }

  /* jshint loopfunc:true */
  // r.assignees is an object w format: { phonenum: true, phonenum: false, ... }
  getRoommateIds(assignees) {
    var roommateIdArray = [];
    for (var phoneNum in assignees) {
      if (assignees[phoneNum] === true) {
        for (var rm in this.onboardingData.roommates) {
          if (this.onboardingData.roommates[rm].phone == phoneNum) {
            roommateIdArray.push(this.onboardingData.roommates[rm]._id);
          }
        }
      }
    }
    return roommateIdArray;
  }

  // After clicking finish
  finishOnboarding() {

    // Create the room
    this.roomService.createRoom({
      _creator: this.currentUser._id,
      name: this.onboardingData.roomName,
      address: this.onboardingData.roomAddress
    })
      .then(response => {

        var roomId = response.data._id;
        var userOpts = {
          userId: this.currentUser._id
        };
        this.userService.updateUserRooms(
          userOpts,
          { roomId: roomId }
        );

        function addRoommates(self, rm, roomId) {
          var roommate = self.onboardingData.roommates[rm];
          return self.$q(function(resolve) {
            self.roommateService.createRoommate({
              _roomId: roomId,
              name: roommate.name,
              phone: parseInt(roommate.phone)
            }).then(response => {
              self.onboardingData.roommates[rm]._id = response.data._id;
              resolve(self);
            });
          });
        }

        function addReminders(self, rd) {
          return self.$q(function(resolve) {
            var reminder = self.onboardingData.reminders[rd];

            self.reminderService.createReminder({
              name: reminder.name,
              assignees: self.getRoommateIds(reminder.assignees),
              datetime: reminder.datetime,
              recurType: reminder.recurType,
              doesRecur: reminder.doesRecur,
              active: reminder.active
            }).then(response => {
              self.onboardingData.reminders[rd]._id = response.data._id;
              resolve(self);
            });
          });
        }

        // Populate all roommate promises
        var roommatePromises = [];
        for (var rm in this.onboardingData.roommates) {
          roommatePromises.push(addRoommates(this, rm, roomId));
        }

      // Add all roommates
      this.$q.all(roommatePromises).then((values) => {
        var self = values[0];

        // Populate all reminder promises
        var reminderPromises = [];
        for (var rd in self.onboardingData.reminders) {
          reminderPromises.push(addReminders(self, rd));
        }

        // Add all reminders
        self.$q.all(reminderPromises).then((values) => {
          var roommateIdArray = [],
            reminderIdArray = [],
            self = values[0];

          // Populate arrays with roommateId's, reminderId's
          self.onboardingData.roommates.forEach(function(p) {
            roommateIdArray.push(p._id);
          });
          self.onboardingData.reminders.forEach(function(r) {
            reminderIdArray.push(r._id);
          });

          var opts = {
            roomId: roomId
          };

          // update rooms with roommates, reminders
          self.roomService.updateRoom( opts, {
            roommates: roommateIdArray,
            reminders: reminderIdArray
          })
            .then(() => {
              self.$state.go('room');
            });
        });

      });
    });

    // TODO: Need to make sure that we update user's onboarding bool to true
  }

  showFormAlert(input) {
    switch(input) {
      case 'roomName':
        this.formAlerts.push({
          type: 'danger',
          msg: 'Don\'t forget to add your room name!'
        });
        this.showAlert = true;
        break;

      case 'atLeastOneRoommate':
        this.formAlerts.push({
          type: 'danger',
          msg: 'Make sure you add at least one roommate.'
        });
        this.showAlert = true;
        break;

      default:
        break;
    }
  }

  closeFormAlert(index) {
    this.formAlerts.splice(index, 1);
    console.log(this.onboardingData.reminderDate);
  }

}

angular.module('higginsApp')
  .controller('OnboardingController', OnboardingController);
