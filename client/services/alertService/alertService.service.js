'use strict';

angular.module('higginsApp.alertService', [])
  .factory('alertService', function () {

    var formAlerts = [];

    var showFormAlert = function(input) {
      switch(input) {
        // Room Alerts
        case 'roomName':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Don\'t forget to add your room name!'
          });
          break;

        // Roommate Alerts
        case 'roommateName':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Please give your roommate a name.'
          });
        break;
        case 'roommatePhoneNumber':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Please enter your roommates 10 digit phone number.'
          });
        break;
        case 'atLeastOneRoommate':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Make sure you add at least one roommate.'
          });
          break;

        // Reminder Alerts
        case 'reminderName':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Please name your reminder.'
          });
          break;
        case 'atLeastOneAssignee':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Remember to assign someone to complete the task!'
          });
        break;
        case 'reminderDateTime':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Make sure to choose a date and time for your reminder.'
          });
        break;
        case 'atLeastOneReminder':
          this.formAlerts.push({
            type: 'danger',
            msg: 'Make sure you add at least one reminder.'
          });
          break;

        default:
          break;
      }
    };

    var closeFormAlert = function (index) {
      formAlerts.splice(index, 1);
      // console.log(this.onboardingData.reminderDate);
    };

    // do not need to use if dismiss-on-timeout is used
    var clearAlerts = function () {
      formAlerts = [];
    }

    // Public API here
    return {
      formAlerts: formAlerts,
      showFormAlert: showFormAlert,
      closeFormAlert: closeFormAlert
    };

  });
