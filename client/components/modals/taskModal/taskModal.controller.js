'use strict';

class TaskModalController {

  constructor($scope, $uibModalInstance, alertService) {
    this.$scope = $scope;

    this.$uibModalInstance = $uibModalInstance;
    this.alertService = alertService;
    this._ = _;

    this.focusInput = true;

    this.members = this.$scope.$resolve.members;

    if (!!this.$scope.$resolve.task) {

      this.task = {
        _id : this.$scope.$resolve.task._id,
        name : this.$scope.$resolve.task.name,
        assignees: this.populateAssigneeDict(this.$scope.$resolve.task.assignees),
        datetime: this.$scope.$resolve.task.datetime,
        doesRecur: this.$scope.$resolve.task.doesRecur,
        recurType: this.$scope.$resolve.task.recurType
      };
      this.prevTask = angular.copy(this.task);

    } else {

      this.task = {
        name: '',
        assignees: {},
        datetime: new Date(),
        doesRecur: false,
        recurType: null
      };

    }

    this.dateTimeOptions = {
      minDate: new Date(),
      showClose: true,
      focusOnShow: false,
      allowInputToggle: true,
      format: 'ddd MMM D, YYYY h:mm a'
    };

  }

  populateAssigneeDict(assignees) {
    var dict = {};
    assignees.forEach(function (a) {
      dict[a] = true;
    });
    return dict;
  }

  openTaskDateTimePicker(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // TODO: add checking for prev task === task so that we dont always send the put/post?
  add() {
    var taskNameExists = true,
      AssigneeAdded = true,
      dateTimePicked = true;

    if (!this.task.name) {
      taskNameExists = false;
      this.alertService.showFormAlert('taskName');
    }

    if (Object.keys(this.task.assignees).length === 0) {
      AssigneeAdded = false;
      this.alertService.showFormAlert('atLeastOneAssignee');
    }

    if (!this.task.datetime) {
      dateTimePicked = false;
      this.alertService.showFormAlert('taskDateTime');
    }

    if (taskNameExists && dateTimePicked && AssigneeAdded) {
      this.$uibModalInstance.close(this.task);
      this.focusInput = false;
    }
  }

  edit() {
    var taskNameExists = true,
        AssigneeAdded = true,
        dateTimePicked = true;

    if (!this.task.name) {
      taskNameExists = false;
      this.alertService.showFormAlert('taskName');
    }

    if (Object.keys(this.task.assignees).length === 0) {
      AssigneeAdded = false;
      this.alertService.showFormAlert('atLeastOneAssignee');
    }

    if (!this.task.datetime) {
      dateTimePicked = false;
      this.alertService.showFormAlert('taskDateTime');
    }

    if ( (this.task.datetime) ||
         (taskNameExists && dateTimePicked && AssigneeAdded) ) {
      if (this._.isEqual(this.prevTask, this.task)) {
          this.$uibModalInstance.dismiss('no change');
        } else {
          this.$uibModalInstance.close(this.task);
        }
      this.focusInput = false;
    }
  }


  cancel() {
    this.$uibModalInstance.dismiss('cancel');
    this.focusInput = false;
  }


}

angular.module('higginsApp')
  .controller('TaskModalController', TaskModalController);
