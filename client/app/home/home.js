'use strict';

angular.module('higginsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        template: '<home></home>'
      });
  });
