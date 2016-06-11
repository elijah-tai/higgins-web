'use strict';

angular.module('higginsApp', ['higginsApp.auth', 'higginsApp.admin', 'higginsApp.constants', 'higginsApp.reminderService', 'higginsApp.roommateService', 'higginsApp.roomService', 'higginsApp.userService', 'ngAnimate', 'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io', 'ui.router', 'validation.match', 'ui.bootstrap', 'ui.bootstrap.alert', 'ui.bootstrap.dropdown', 'ui.bootstrap.datepicker', 'ui.bootstrap.modal', 'ui.bootstrap.timepicker', 'ui.bootstrap.datetimepicker' ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  });
