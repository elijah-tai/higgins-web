'use strict';

class ReminderModalController {

  constructor($scope, $uibModalInstance, alertService) {
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this.alertService = alertService;

    this.dateTimePickerOpen = false;

    this.roommates = this.$scope.$resolve.roommates;

    this.reminder = {
      name: '',
      assignees: [],
      datetime: new Date(),
      doesRecur: false,
      recurType: null
    };

    var self = this;

    // date picker
    this.dateOptions = {
      min: new Date(),
      format: 'mmmm d, yyyy',
      onSet: function(e) {
        // e.select is number of milliseconds since Unix Epoch
        self.date = new Date(e.select);
        if (!!self.time) {
          var secondsSinceEpoch = self.date.setMinutes(self.time);
          self.reminder.datetime = new Date(secondsSinceEpoch);
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
          self.reminder.datetime = new Date(secondsSinceEpoch);
        }
      }
    };
  }

  openReminderDateTimePicker(e) {
    e.preventDefault();
    e.stopPropagation();

    this.dateTimePickerOpen = true;
  }

  add() {
    var reminderNameExists = true;
    if (!this.reminder.name) {
      reminderNameExists = false;
      this.alertService.showFormAlert('reminderName');
    }

    var AssigneeAdded = true;
    if (this.reminder.assignees.length === 0) {
      AssigneeAdded = false;
      this.alertService.showFormAlert('atLeastOneAssignee');
    }

    var dateTimePicked = true;
    if (!this.time || !this.date) {
      dateTimePicked = false;
      this.alertService.showFormAlert('reminderDateTime');
    }

    if (reminderNameExists && dateTimePicked && AssigneeAdded) {
      this.$uibModalInstance.close(this.reminder);
    }
  }

  edit() {

  }


  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }


}

angular.module('higginsApp')
  .controller('ReminderModalController', ReminderModalController);
