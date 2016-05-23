'use strict';

angular.module('higginsApp', ['higginsApp.auth', 'higginsApp.admin', 'higginsApp.constants',
    'ngAnimate', 'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io', 'ui.router', 'validation.match'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });
