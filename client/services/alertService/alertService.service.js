'use strict';

angular.module('higginsApp.alertService', [])
  .factory('alertService', function () {

    var formAlerts = [];

    var showFormAlert = function(input) {
      switch(input) {
        // Group Alerts
        case 'groupName':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Don\'t forget to add your group name!'
          });
          break;

        // Member Alerts
        case 'memberName':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Please give your member a name.'
          });
        break;
        case 'memberPhoneNumber':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Please enter your members 10 digit phone number.'
          });
        break;
        case 'atLeastOneMember':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Make sure you add at least one member.'
          });
          break;

        // Task Alerts
        case 'taskName':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Please name your task.'
          });
          break;
        case 'atLeastOneAssignee':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Remember to assign someone to complete the task!'
          });
        break;
        case 'taskDateTime':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Make sure to choose a date and time for your task.'
          });
        break;
        case 'atLeastOneTask':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Make sure you add at least one task.'
          });
          break;

        default:
          break;
      }
    };

    var closeFormAlert = function (index) {
      formAlerts.splice(index, 1);
      // console.log(this.onboardingData.taskDate);
    };

    // do not need to use if dismiss-on-timeout is used
    // var clearAlerts = function () {
    //   formAlerts = [];
    // };

    // Public API here
    return {
      formAlerts: formAlerts,
      showFormAlert: showFormAlert,
      closeFormAlert: closeFormAlert
    };

  });
