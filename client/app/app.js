'use strict';

angular.module('higginsApp',
  ['higginsApp.auth',
    'higginsApp.admin',
    'higginsApp.constants',
    'higginsApp.reminderService',
    'higginsApp.roommateService',
    'higginsApp.roomService',
    'higginsApp.userService',
    'higginsApp.alertService',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'btford.socket-io',
    'ui.router',
    'validation.match',
    'ui.bootstrap',
    'ui.bootstrap.alert',
    'ui.bootstrap.buttons',
    'ui.bootstrap.dropdown',
    'ui.bootstrap.modal',
    'ui.checkbox',
    'frapontillo.bootstrap-switch',
    'ae-datetimepicker'
  ]
)
  .constant('_', window._)
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  });

