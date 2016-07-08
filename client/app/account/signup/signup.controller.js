'use strict';

class SignupController {
  //end-non-standard

  constructor(Auth, $rootScope, $state, roomService, roommateService, userService, socket) {
    this.Auth = Auth;
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.socket = socket;

    this.roomService = roomService;
    this.roommateService = roommateService;
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
              var roomname = user.name + '\'s room';
              this.roomService.createRoom({
                _creator: user._id,
                name: roomname
              })
                .then(response => {
                  var roomId = response.data._id;
                  this.userService.updateUserRooms(
                    { userId: user._id },
                    { roomId: roomId }
                  );
                  this.roommateService.createRoommate({
                    _roomId: roomId,
                    _creator: user._id,
                    name: user.name,
                    phone: user.phone
                  })
                    .then((response) => {
                      var roommateId = response.data._id;
                      this.roomService.addRoommate({ roomId: roomId, roommateId: roommateId })
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
