'use strict';

angular.module('higginsApp')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('onboarding', {
        url: '/onboarding',
        templateUrl: 'app/onboarding/onboarding.html',
        authenticate: true,
        controller: 'OnboardingController',
        controllerAs: 'onboardCtrl'
      })

      .state('onboarding.room', {
        url: '/room',
        authenticate: true,
        templateUrl: 'app/onboarding/partials/onboarding-room.html'
      })

      .state('onboarding.roommates', {
        url: '/roommates',
        authenticate: true,
        templateUrl: 'app/onboarding/partials/onboarding-roommates.html'
      })

      .state('onboarding.reminders', {
        url: '/reminders',
        authenticate: true,
        templateUrl: 'app/onboarding/partials/onboarding-reminders.html'
      });

    $urlRouterProvider.otherwise('/onboarding/room');

  });
