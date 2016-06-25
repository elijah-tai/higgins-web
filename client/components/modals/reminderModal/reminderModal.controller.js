'use strict';

class ReminderModalController {

  constructor($scope, $uibModalInstance) {
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;

    this.dateTimePickerOpen = false;

    this.roommates = this.$scope.$resolve.roommates;

    this.reminder = {
      name: '',
      assignees: [],
      datetime: new Date(),
      doesRecur: false,
      recurType: 'Select One'
    };

    var self = this;

    // date picker
    this.dateOptions = {
      min: new Date(),
      format: 'mmmm d, yyyy',
      onSet: function(e) {
        // e.select is number of milliseconds since Unix Epoch
        self.date = new Date(e.select);
      }
    };

    // time picker
    this.timeOptions = {
      interval: 1,
      closeOnSelect: true,
      onSet: function(e) {
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
    this.$uibModalInstance.close(this.reminder);
  }

  edit() {

  }


  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }


}

angular.module('higginsApp')
  .controller('ReminderModalController', ReminderModalController);
