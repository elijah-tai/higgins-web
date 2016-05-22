'use strict';

angular.module('higginsApp')
  .config(function($stateProvider) {
    $stateProvider.state('main', {
      url: '/',
      template: '<main></main>',
      authenticate: false
    });
  });
