'use strict';

// optional: room address
// required: room name,
//           at least 1 room mate,
//           at least 1 reminder

class OnboardingController {

  constructor($scope, $rootScope, $http, $q) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$http = $http;
    this.$q = $q;

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
    // TODO: validate roommateModal
    this.onboardingData.roommates.push({
      name: this.onboardingData.roommateName,
      phone: this.onboardingData.roommatePhone,
      roommateId: '' // mongoose.Types.ObjectId
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
    this.onboardingData.reminders.push({
      name: this.onboardingData.reminderName,
      assignees: this.onboardingData.selectedRoommates, // ng-model = {}
      datetime: this.onboardingData.reminderDateTime,
      recurType: this.onboardingData.reminderRecursType,
      doesRecur: this.onboardingData.reminderDoesRecur,
      active: true,
      reminderId: ''
    });
  }

  /* jshint loopfunc:true */
  // r.assignees is an object
  getRoommateIds(o) {
    var roommateIdArray = [];
    for (var phoneNum in o) {
      if (o[phoneNum] === true) {
        this.onboardingData.roommates.forEach(function(p) {
          if (p.phone === phoneNum) {
            roommateIdArray.push(p._id);
          }
        });
      }
    }
    return roommateIdArray;
  }

  // after clicking finish
  finishOnboarding() {

    // api -> rooms
    this.$http.post('/api/rooms', {
      _creator: this.currentUser._id,
      name: this.onboardingData.roomName,
      address: this.onboardingData.roomAddress
      // roommates, reminders
    }).then(response => {
      var roomId = response.data._id;

      /* jshint loopfunc:true */
      function addRoommates(self) {
        return self.$q(function(resolve) {
          for (var rm in self.onboardingData.roommates) {
            var roommate = self.onboardingData.roommates[rm];
            self.$http.post('/api/roommates', {
              _roomId: roomId,
              name: roommate.name,
              phone: parseInt(roommate.phone)
            }).then(response => {
              self.onboardingData.roommates[rm]._id = response.data._id;
              resolve(self);
            });
          }
        });
      }

      function addReminders(self) {
        return self.$q(function(resolve) {
          for (var rd in self.onboardingData.reminders) {
            var reminder = self.onboardingData.reminders[rd];
            self.$http.post('/api/reminders', {
              name: reminder.name,
              assignees: self.getRoommateIds(reminder.assignees), // array of object ids of
              // // roommateModal
              datetime: reminder.datetime,
              recurType: reminder.recurType,
              doesRecur: reminder.doesRecur,
              active: reminder.active
            }).then(response => {
              self.onboardingData.reminders[rd]._id = response.data._id;
              resolve(self);
            });
          }
        });
      }

      /* jshint loopfunc:true */
      addRoommates(this).then(function(self) { // add reminders
        return addReminders(self);
      }).then(function(self) {
        var roommateIdArray = [],
            reminderIdArray = [];

        self.onboardingData.roommates.forEach(function(p) {
          roommateIdArray.push(p._id);
        });
        self.onboardingData.reminders.forEach(function(r) {
          reminderIdArray.push(r._id);
        });

        // update rooms with roommates, reminders
        self.$http.put('/api/rooms/' + roomId, {
          roommates: roommateIdArray,
          reminders: reminderIdArray
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
          msg: 'Make sure you add at least one roommateModal.'
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
