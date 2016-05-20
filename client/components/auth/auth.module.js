'use strict';

angular.module('higginsApp.auth', ['higginsApp.constants', 'higginsApp.util', 'ngCookies',
    'ui.router'
  ])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
