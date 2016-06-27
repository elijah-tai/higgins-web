'use strict';

angular.module('higginsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('about', {
        url: '/about',
        template: '<about></about>'
      });
  });
