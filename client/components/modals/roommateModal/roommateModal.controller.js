'use strict';

class RoommateModalController {

  constructor($scope, $uibModalInstance, alertService) {
    this.$scope = $scope;

    this.$uibModalInstance = $uibModalInstance;
    this.name = '';
    this.phone = '';
    this.formAlerts = [];
    this.alertService = alertService;
    this.focusInput = true;

    if (!!this.$scope.$resolve.roommate) {
      this.roommateId = this.$scope.$resolve.roommate._id;
      this.name = this.$scope.$resolve.roommate.name;
      this.phone = this.$scope.$resolve.roommate.phone.toString();
    }
  }

  add() {
    var nameExists = true;
    if (!this.name) {
      this.alertService.showFormAlert('roommateName');
      nameExists = false;
    }

    var phoneValid = true;
    if ( !this.phone || (this.phone.length !== 10) ) {
      this.alertService.showFormAlert('roommatePhoneNumber');
      phoneValid = false;
    }

    if (nameExists && phoneValid) {
      this.$uibModalInstance.close({
        name: this.name,
        phone: parseInt(this.phone, 10)
      });
      this.focusInput = false;
    }
  }

  edit() {    
    var nameExists = true;
    if (!this.name) {
      this.alertService.showFormAlert('roommateName');
      nameExists = false;
    }

    var phoneValid = true;
    if ( !this.phone || (this.phone.length !== 10) ) {
      this.alertService.showFormAlert('roommatePhoneNumber');
      phoneValid = false;
    }

    if (nameExists && phoneValid) {
      this.$uibModalInstance.close({
        _id: this.roommateId,
        name: this.name,
        phone: parseInt(this.phone, 10)
      });
      this.focusInput = false;
    }
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
    this.focusInput = false;
  }

  validate() {
    
  }

}

angular.module('higginsApp')
  .controller('RoommateModalController', RoommateModalController);
