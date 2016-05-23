'use strict';

angular.module('higginsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/home/home.html',
        authenticate: true,
        controller: 'HomeController',
        controllerAs: 'homeCtrl'
      });
  });
