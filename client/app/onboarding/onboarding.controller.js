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
      recurrenceType: 'None',
      roomMates: [],
      reminders: [],
      reminderDateTime: new Date()
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

  addRoomMate() {
    // TODO: validate roommate
    this.onboardingData.roomMates.push({
      name: this.onboardingData.roomMateName,
      phone: this.onboardingData.roomMatePhone,
      roomMateId: '' // mongoose.Types.ObjectId
    });

    this.onboardingData.roomMateName = '';
    this.onboardingData.roomMatePhone = '';
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
      assignees: this.onboardingData.selectedRoomMates, // ng-model = {}
      datetime: this.onboardingData.reminderDateTime,
      recurs: {
        type: this.onboardingData.reminderRecursType,
        doesRecur: this.onboardingData.reminderDoesRecur
      },
      active: true,
      reminderId: ''
    });
  }

  /* jshint loopfunc:true */
  // r.assignees is an object
  getRoommateIds(o) {
    var roomMateIdArray = [];
    for (var phoneNum in o) {
      if (o[phoneNum] === true) {
        this.onboardingData.roomMates.forEach(function(p) {
          if (p.phone === phoneNum) {
            roomMateIdArray.push({'$oid': p._id});
          }
        });
      }
    }
    console.log(roomMateIdArray);
    return roomMateIdArray;
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
      console.log('finished posting room', roomId);

      /* jshint loopfunc:true */
      function addRoomMates(self) {
        return self.$q(function(resolve) {
          for (var rm in self.onboardingData.roomMates) {
            var roomMate = self.onboardingData.roomMates[rm];
            console.log('roomMate: ' + roomMate.name);
            self.$http.post('/api/roomMates', {
              _roomId: roomId,
              name: roomMate.name,
              phone: parseInt(roomMate.phone)
            }).then(response => {
              self.onboardingData.roomMates[rm]._id = response.data._id;
              console.log('finished posting roommate', roomMate.name, roomMate.roomMateId);
              resolve(self);
            });
          }
        });
      }

      /* jshint loopfunc:true */
      addRoomMates(this).then(function(self) { // add reminders
        for (var rd in self.onboardingData.reminders) {
          var reminder = self.onboardingData.reminders[rd];
          console.log('reminder: ' + reminder.name);
          self.$http.post('/api/reminders', {
            name: reminder.name,
            assignees: self.getRoommateIds(reminder.assignees), // array of object ids of
            // roommate
            datetime: reminder.datetime,
            recurs: reminder.recurs,
            active: reminder.active
          }).then(response => {
            console.log(response);
            this.onboardingData.reminders[rd]._id = response.data._id;
            console.log('finished posting reminder', reminder.name, reminder.reminderId);
          });
        }
      });

      var roomMateIdArray = [],
          reminderIdArray = [];

      this.onboardingData.roomMates.forEach(function(p) {
        roomMateIdArray.push(p._id);
      });
      this.onboardingData.reminders.forEach(function(r) {
        reminderIdArray.push(r._id);
      });

      console.log(roomMateIdArray);
      console.log(reminderIdArray);

      // update rooms with roommates, reminders
      this.$http.patch('/api/rooms/' + roomId, {
        roomMates: roomMateIdArray,
        reminders: reminderIdArray
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

      case 'atLeastOneRoomMate':
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
