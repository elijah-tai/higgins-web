'use strict';

class RoommateModalController {

  constructor($scope, $uibModalInstance, alertService) {
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this._ = _;

    this.name = '';
    this.phone = '';
    this.formAlerts = [];
    this.alertService = alertService;
    this.focusInput = true;

    if (!!this.$scope.$resolve.roommate) {
      this.roommateId = this.$scope.$resolve.roommate._id;
      this.name = this.$scope.$resolve.roommate.name;
      this.phone = (this.$scope.$resolve.roommate.phone) ? (this.$scope.$resolve.roommate.phone).toString() : '';
      this.prevRoommate = {
        _id : angular.copy(this.roommateId),
        name: angular.copy(this.name),
        phone: angular.copy(this.phone)
      };
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
        phone: this.phone
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
      var roommate = {
        _id: this.roommateId,
        name: this.name,
        phone: this.phone
      };

      if (this._.isEqual(roommate, this.prevRoommate)) {
        this.$uibModalInstance.dismiss('no change');
      } else {
        this.$uibModalInstance.close(roommate);
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
  .controller('RoommateModalController', RoommateModalController);
