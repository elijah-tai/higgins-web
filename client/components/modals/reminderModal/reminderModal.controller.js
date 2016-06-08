'use strict';

class ReminderModalController {

  constructor($scope, $uibModalInstance) {
    this.$scope = $scope;
  }

}

angular.module('higginsApp')
  .controller('ReminderModalController', ReminderModalController);
