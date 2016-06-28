'use strict';

angular.module('higginsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard/dashboard.html',
        authenticate: true,
        controller: 'DashboardController',
        controllerAs: 'dashCtrl'
      });
  });
