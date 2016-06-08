'use strict';

class RoommateModalController {

  constructor($scope, $uibModalInstance) {
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this.name = '';
    this.phone = '';
  }

  add() {
    // TODO: Add form validation for this one too
    this.$uibModalInstance.close({
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
