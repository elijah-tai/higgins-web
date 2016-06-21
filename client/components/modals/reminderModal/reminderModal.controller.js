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
