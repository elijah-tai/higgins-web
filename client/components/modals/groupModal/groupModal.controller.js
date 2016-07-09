'use strict';

class GroupModalController {

  constructor($scope, $uibModalInstance) {
    this.$scope = $scope;

    this.$uibModalInstance = $uibModalInstance;

    if (!!this.$scope.$resolve.groupId) {
      this.groupId = this.$scope.$resolve.groupId;
    }
  }

  confirmDelete() {
    this.$uibModalInstance.close(
      this.groupId
    );
  }

  cancelDelete() {
    this.$uibModalInstance.dismiss('cancel');
  }

}

angular.module('higginsApp')
  .controller('GroupModalController', GroupModalController);
