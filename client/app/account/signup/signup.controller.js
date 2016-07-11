'use strict';

class SignupController {
  //end-non-standard

  constructor(Auth, $rootScope, $state, groupService, memberService, userService, socket) {
    this.Auth = Auth;
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.socket = socket;

    this.groupService = groupService;
    this.memberService = memberService;
    this.userService = userService;

    this.focusInput = true;
  }
    //start-non-standard

  register(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.createUser({
          name: this.user.name,
          email: this.user.email,
          phone: parseInt(this.user.phone, 10),
          password: this.user.password
        })
        .then(() => {

          this.$rootScope.nav.getCurrentUser((user) => {
            return user;
          })
            .then(user => {
              var groupname = user.name + '\'s group';
              this.groupService.createGroup({
                creator: user._id,
                name: groupname
              })
                .then(response => {

                  var groupId = response.data._id;
                  this.userService.updateUserGroups(
                    { userId: user._id },
                    { groupId: groupId }
                  );

                  this.memberService.createMember({
                    group: groupId,
                    creator: user._id,
                    name: user.name,
                    phone: user.phone
                  })
                    .then((response) => {
                      var memberId = response.data._id;
                      this.groupService.addMember({ groupId: groupId, memberId: memberId })
                        .then(() => {
                          this.$state.go('dashboard');
                        });
                    });
                });
            });
        })
        .catch(err => {
          err = err.data;
          this.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        });
    }
  }
}

angular.module('higginsApp')
  .controller('SignupController', SignupController);
