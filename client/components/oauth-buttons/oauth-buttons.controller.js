'use strict';

angular.module('higginsApp')
  .controller('OauthButtonsCtrl', function($window, $location) {
    this.isLoggingIn = false;
    this.isSigningUp = false;

    this.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    if ($location.path() === '/login') {
      this.isLoggingIn = true;
    } else if ($location.path() === '/signup') {
      this.isSigningUp = true;
    }

  });
