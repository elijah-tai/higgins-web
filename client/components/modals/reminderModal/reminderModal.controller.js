'use strict';

class ReminderModalController {

  constructor($scope, $uibModalInstance, alertService) {
    this.$scope = $scope;

    this.$uibModalInstance = $uibModalInstance;
    this.alertService = alertService;
    this.focusInput = true;
    this.chooseNewDate = true;

    this.roommates = this.$scope.$resolve.roommates;

    if (!!this.$scope.$resolve.reminder) {

      this.reminder = {
        _id : this.$scope.$resolve.reminder._id,
        name : this.$scope.$resolve.reminder.name,
        assignees: this.populateAssigneeDict(this.$scope.$resolve.reminder.assignees),
        datetime: this.$scope.$resolve.reminder.datetime,
        doesRecur: this.$scope.$resolve.reminder.doesRecur,
        recurType: this.$scope.$resolve.reminder.recurType
      };

    } else {

      this.reminder = {
        name: '',
        assignees: {},
        datetime: new Date(),
        doesRecur: false,
        recurType: null
      };

    }

    this.minDate = new Date();

  }

  populateAssigneeDict(assignees) {
    var dict = {};
    assignees.forEach(function (a) {
      dict[a] = true;
    });
    return dict;
  }

  openReminderDateTimePicker(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // TODO: add checking for prev reminder === reminder so that we dont always send the put/post?
  add() {
    var reminderNameExists = true,
      AssigneeAdded = true,
      dateTimePicked = true;

    if (!this.reminder.name) {
      reminderNameExists = false;
      this.alertService.showFormAlert('reminderName');
    }

    if (Object.keys(this.reminder.assignees).length === 0) {
      AssigneeAdded = false;
      this.alertService.showFormAlert('atLeastOneAssignee');
    }

    if (!this.reminder.datetime) {
      dateTimePicked = false;
      this.alertService.showFormAlert('reminderDateTime');
    }

    if (reminderNameExists && dateTimePicked && AssigneeAdded) {
      this.$uibModalInstance.close(this.reminder);
      this.focusInput = false;
    }
  }

  edit() {
    var reminderNameExists = true,
        AssigneeAdded = true,
        dateTimePicked = true;

    if (!this.reminder.name) {
      reminderNameExists = false;
      this.alertService.showFormAlert('reminderName');
    }

    if (Object.keys(this.reminder.assignees).length === 0) {
      AssigneeAdded = false;
      this.alertService.showFormAlert('atLeastOneAssignee');
    }

    if (!this.reminder.datetime) {
      dateTimePicked = false;
      this.alertService.showFormAlert('reminderDateTime');
    }

    if ( (!this.chooseNewDate && this.reminder.datetime) ||
         (reminderNameExists && dateTimePicked && AssigneeAdded) ) {
      this.$uibModalInstance.close(this.reminder);
      this.focusInput = false;
    }
  }


  cancel() {
    this.$uibModalInstance.dismiss('cancel');
    this.focusInput = false;
  }


}

angular.module('higginsApp')
  .controller('ReminderModalController', ReminderModalController);
