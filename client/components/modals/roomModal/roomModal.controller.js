'use strict';

class RoomModalController {

  constructor($scope, $uibModalInstance) {
    this.$scope = $scope;

    this.$uibModalInstance = $uibModalInstance;

    if (!!this.$scope.$resolve.roomId) {
      this.roomId = this.$scope.$resolve.roomId;
    }
  }

  confirmDelete() {
    this.$uibModalInstance.close(
      this.roomId
    );
  }

  cancelDelete() {
    this.$uibModalInstance.dismiss('cancel');
  }

}

angular.module('higginsApp')
  .controller('RoomModalController', RoomModalController);
