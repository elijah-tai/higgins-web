'use strict';

// optional: room address
// required: room name,
//           at least 1 room mate,
//           at least 1 reminder

class OnboardingController {

  constructor($scope, $rootScope, $q, $state, $window, roomService, userService, roommateService, reminderService, alertService) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$q = $q;
    this.$state = $state;
    this.$window = $window;

    this.roomService = roomService;
    this.userService = userService;
    this.roommateService = roommateService;
    this.reminderService = reminderService;
    this.alertService = alertService;
    this.focusInput = {
      'room': true,
      'roommates': false,
      'reminders': false
    };

    this.currentUser = null;

    // this.formAlerts = [];
    this.$scope.currentview = this.$state.current.name;

    this.reminderDateTimePickerOpen = false;

    this.onboardingData = {
      roommates: [],
      reminders: [],
      reminderDateTime: new Date(),
      reminderRecursType: null,
      reminderDoesRecur: false
    };

    var self = this;

    // TODO: extract this out to time service
    // date picker
    this.dateOptions = {
      min: new Date(),
      format: 'mmmm d, yyyy',
      onSet: function(e) {
        // e.select is number of milliseconds since Unix Epoch
        self.date = new Date(e.select);
        if (!!self.time) {
          var secondsSinceEpoch = self.date.setMinutes(self.time);
          self.onboardingData.reminderDateTime = new Date(secondsSinceEpoch);
        }
      }
    };

    // time picker
    this.timeOptions = {
      min: new Date(),
      interval: 1,
      closeOnSelect: true,
      onSet: function(e) {
        self.time = e.select;
        if (!!self.date) {
          // e.select is number of minutes after midnight
          var date = self.date;
          var secondsSinceEpoch = date.setMinutes(e.select);
          self.onboardingData.reminderDateTime = new Date(secondsSinceEpoch);
        }
      }
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
    var nameExists = true;
    if (!this.onboardingData.roommateName) {
      this.alertService.showFormAlert('roommateName');
      nameExists = false;
    }

    var phoneValid = true;
    if ( !this.onboardingData.roommatePhone || (this.onboardingData.roommatePhone.length !== 10) ) {
      this.alertService.showFormAlert('roommatePhoneNumber');
      phoneValid = false;
    }

    if (nameExists && phoneValid) {
      this.onboardingData.roommates.push({
        name: this.onboardingData.roommateName,
        phone: this.onboardingData.roommatePhone,
        _id: '' // mongoose.Types.ObjectId
      });

      this.onboardingData.roommateName = '';
      this.onboardingData.roommatePhone = '';

      this.focusInput = { 'room': false, 'roommates': true, 'reminders': false };
    }
  }

  openReminderDateTimePicker(e) {
    e.preventDefault();
    e.stopPropagation();

    this.reminderDateTimePickerOpen = true;
  }

  addReminder() {
    var reminderNameExists = true;
    if (!this.onboardingData.reminderName) {
      reminderNameExists = false;
      this.alertService.showFormAlert('reminderName');
    }

    var assignees = [];
    for (var phoneNum in this.onboardingData.selectedRoommates) {
      if (this.onboardingData.selectedRoommates[phoneNum] === true) {
        assignees.push(phoneNum);
      }
    }

    var AssigneeAdded = true;
    if (assignees.length === 0) {
      AssigneeAdded = false;
      this.alertService.showFormAlert('atLeastOneAssignee');
    }

    var dateTimePicked = true;
    if (!this.time || !this.date) {
      dateTimePicked = false;
      this.alertService.showFormAlert('reminderDateTime');
    }

    if (reminderNameExists && dateTimePicked && AssigneeAdded) {
      this.onboardingData.reminders.push({
        name: this.onboardingData.reminderName,
        assignees: assignees, // ng-model = {}
        datetime: this.onboardingData.reminderDateTime,
        recurType: this.onboardingData.reminderRecursType,
        doesRecur: this.onboardingData.reminderDoesRecur,
        active: true,
        _id: ''
      });

      this.resetReminder();
      this.focusInput = { 'room': false, 'roommates': false, 'reminders': true };
    }
  }

  resetReminder() {
    // reset reminder
    this.onboardingData.reminderName = '';
    this.onboardingData.selectedRoommates = null;
    this.time = null; this.date = null;
    this.onboardingData.reminderDateTime = null;
    this.onboardingData.reminderDoesRecur = false;
    this.onboardingData.reminderRecursType = 'Select One';
  }

  /* jshint loopfunc:true */
  // r.assignees is an object w format: { phonenum: true, phonenum: false, ... }
  getRoommateIds(self, assignees) {
    var roommateIdArray = [];
      assignees.forEach(function(phoneNum) {
        for (var roommate in self.onboardingData.roommates) {
          if (self.onboardingData.roommates[roommate].phone === phoneNum) {
            roommateIdArray.push(self.onboardingData.roommates[roommate]._id);
          }
        }
      });
    return roommateIdArray;
  }

  addRoommates(self, rm, roomId) {
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

  addReminders(self, rd) {
    return self.$q(function(resolve) {
      var reminder = self.onboardingData.reminders[rd];

      self.reminderService.createReminder({
        name: reminder.name,
        assignees: self.getRoommateIds(self, reminder.assignees),
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

        // Populate all roommate promises
        var roommatePromises = [];
        for (var rm in this.onboardingData.roommates) {
          roommatePromises.push(this.addRoommates(this, rm, roomId));
        }

      // Add all roommates
      this.$q.all(roommatePromises).then((values) => {
        var self = values[0];

        // Populate all reminder promises
        var reminderPromises = [];
        for (var rd in self.onboardingData.reminders) {
          reminderPromises.push(this.addReminders(self, rd));
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

  switchStates(state) {
    this.$state.go(state);
    this.$scope.currentview = state;
    switch(state) {
      case 'onboarding.room':
        this.focusInput = { 'room': true, 'roommates': false, 'reminders': false };
        break;
      case 'onboarding.roommates':
        this.focusInput = { 'room': false, 'roommates': true, 'reminders': false };
        break;
      case 'onboarding.reminders':
        this.focusInput = { 'room': false, 'roommates': false, 'reminders': true };
        break;
    }
  }

  validate(next) {
    switch(this.$state.current.name) {
      case 'onboarding.room':
        if (!this.onboardingData.roomName) { this.alertService.showFormAlert('roomName'); }
        else if (next) {
          this.switchStates(next);
        }
        break;
      case 'onboarding.roommates':
        if (next === 'onboarding.room') {
          this.switchStates(next);
        }
        else if (this.onboardingData.roommates.length === 0) { this.alertService.showFormAlert('atLeastOneRoommate'); }
        else if (next) {
          this.switchStates(next);
        }
        break;
      case 'onboarding.reminders':
        if (next === 'onboarding.roommates' || next === 'onboarding.room') {
          this.switchStates(next);
        }
        else if (this.onboardingData.reminders.length === 0) { this.alertService.showFormAlert('atLeastOneReminder'); }
        else if (next === 'finish') {
          this.finishOnboarding();
        }
        break;
    }
  }

  progress() {
    switch(this.$state.current.name) {
      case 'onboarding.room':
        this.validate('onboarding.roommates');
        break;
      case 'onboarding.roommates':
        if (!!this.onboardingData.roommateName || !!this.onboardingData.roommatePhone) {
          this.addRoommate();
        } else {
          this.validate('onboarding.reminders');
        }
        break;
      case 'onboarding.reminders':
        if (!!this.onboardingData.reminderName || !!this.onboardingData.selectedRoommates || !!this.time || !!this.date) {
          this.addReminder();
        } else {
          this.validate('finish');
        }
        break;
    }
  }

}

angular.module('higginsApp')
  .controller('OnboardingController', OnboardingController);
