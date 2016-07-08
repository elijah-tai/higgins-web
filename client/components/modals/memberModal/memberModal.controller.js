'use strict';

class MemberModalController {

  constructor($scope, $uibModalInstance, alertService) {
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this._ = _;

    this.name = '';
    this.phone = '';
    this.formAlerts = [];
    this.alertService = alertService;
    this.focusInput = true;

    if (!!this.$scope.$resolve.member) {
      this.memberId = this.$scope.$resolve.member._id;
      this.name = this.$scope.$resolve.member.name;
      this.phone = (this.$scope.$resolve.member.phone) ? (this.$scope.$resolve.member.phone).toString() : '';
      this.prevMember = {
        _id : angular.copy(this.memberId),
        name: angular.copy(this.name),
        phone: angular.copy(this.phone)
      };
    }
  }

  add() {
    var nameExists = true;
    if (!this.name) {
      this.alertService.showFormAlert('memberName');
      nameExists = false;
    }

    var phoneValid = true;
    if ( !this.phone || (this.phone.length !== 10) ) {
      this.alertService.showFormAlert('memberPhoneNumber');
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
      this.alertService.showFormAlert('memberName');
      nameExists = false;
    }

    var phoneValid = true;
    if ( !this.phone || (this.phone.length !== 10) ) {
      this.alertService.showFormAlert('memberPhoneNumber');
      phoneValid = false;
    }

    if (nameExists && phoneValid) {
      var member = {
        _id: this.memberId,
        name: this.name,
        phone: this.phone
      };

      if (this._.isEqual(member, this.prevMember)) {
        this.$uibModalInstance.dismiss('no change');
      } else {
        this.$uibModalInstance.close(member);
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
  .controller('MemberModalController', MemberModalController);
