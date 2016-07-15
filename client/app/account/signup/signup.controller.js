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

      var groupId,
          user;

      this.Auth.createUser({
          name: this.user.name,
          email: this.user.email,
          phone: parseInt(this.user.phone, 10),
          password: this.user.password
        })
        .then(() => {

          return this.$rootScope.nav.getCurrentUser(function( user ) {
            return user;
          });

        })
        .then( currentUser => {

          user = currentUser;
          return this.groupService.createGroup({
            creator: user._id,
            name: user.name + '\'s group'
          })
            .then(function( response ) {
              return response.data;
            });

        })
        .then( group => {

          groupId = group._id;
          return this.userService.updateUserGroups(
            { userId: user._id },
            { groupId: group._id }
          );

        })
        .then( () => {

          var self = this;
          this.memberService.findMemberByPhone({
            phone: user.phone
          })
            .success(function( member ) {

              self.groupService.addMember( { groupId: groupId, memberId: member._id } )
                .then(() => {
                  self.$state.go('dashboard');
                });

            })
            .error(function() {

              self.memberService.createMember({
                group: groupId,
                creator: user._id,
                name: user.name,
                phone: user.phone
              })
                .then( response  => {
                  var memberId = response.data._id;
                  return self.groupService.addMember({groupId: groupId, memberId: memberId})
                    .then(() => {
                      self.$state.go('dashboard');
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
