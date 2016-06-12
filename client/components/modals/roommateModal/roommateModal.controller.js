'use strict';

class RoommateModalController {

  constructor($scope, $uibModalInstance) {
    this.$scope = $scope;

    this.$uibModalInstance = $uibModalInstance;
    this.name = '';
    this.phone = '';

    if (!!this.$scope.$resolve.roommate) {
      this.roommateId = this.$scope.$resolve.roommate._id;
      this.name = this.$scope.$resolve.roommate.name;
      this.phone = this.$scope.$resolve.roommate.phone;
    }
  }

  add() {
    // TODO: Add form validation for this one too
    this.$uibModalInstance.close({
      name: this.name,
      phone: this.phone
    });
  }

  edit() {
    this.$uibModalInstance.close({
      _id: this.roommateId,
      name: this.name,
      phone: this.phone
    });
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }

}

angular.module('higginsApp')
  .controller('RoommateModalController', RoommateModalController);
