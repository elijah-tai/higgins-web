'use strict';

class SignupController {
  //end-non-standard

  constructor(Auth, $rootScope, $state, roomService, userService) {
      this.Auth = Auth;
      this.$rootScope = $rootScope;
      this.$state = $state;

      this.roomService = roomService;
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
              //TODO: somehow add user as roommate?
              //      How are we going to do this?
              var roomname = user.name + '\'s room';
              this.roomService.createRoom({
                _creator: user._id,
                name: roomname
              })
                .then(response => {
                  var roomId = response.data._id;
                  var userOpts = { userId: user._id };
                  this.userService.updateUserRooms(
                    userOpts,
                    { roomId: roomId }
                  );
                });

            });

          this.$state.go('room');
        
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
