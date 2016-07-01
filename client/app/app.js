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
    'ngMaterial',
    'btford.socket-io',
    'ui.router',
    'validation.match',
    'ui.bootstrap',
    'ui.bootstrap.alert',
    'ui.bootstrap.dropdown',
    'ui.bootstrap.modal',
    'ui.bootstrap.datetimepicker',
    'frapontillo.bootstrap-switch',
    'datePicker']
)
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  });

