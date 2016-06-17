import schedule from 'node-schedule';
import twilio from 'twilio';
import logger from 'winston';
import Roommate from '../../api/roommate/roommate.model';

var config = require('../../config/environment/index');

var accountSid = config.twilio.accountSid;
var authToken = config.twilio.authToken;
var client = new twilio.RestClient(accountSid, authToken);

export function createSchedule(reminder) {

  var rule = new schedule.RecurrenceRule();
  var date = new Date(reminder.datetime);

  // none, daily, weekly, monthly
  if (reminder.doesRecur) {
    rule.minute = date.getMinutes();
    rule.hour = date.getHours();

    switch (reminder.recurType) {
      case 'Daily':
        rule.dayOfWeek = [new schedule.Range(0, 6)];
        break;

      case 'Weekly':
        rule.dayOfWeek = date.getDay();
        break;

      case 'Monthly':
        rule.date = date.getDate();
        rule.month = [new schedule.Range(0, 11)];
        break;

      case 'Yearly':
        rule.date = date.getDate();
        rule.month = date.getMonth();
        break;
    }

  } else {
    rule = new Date(reminder.datetime);
  }

  schedule.scheduleJob(rule, function() {
    Roommate.find({_id:  { $in: reminder.assignees }}).exec()
      .then(roommates => {

        roommates.forEach(function(roommate) {
          client.messages.create({
            body: 'Salutations, ' + roommate.name + '! Higgins here, just reminding you about ' + reminder.name,
            to: '+1' + roommate.phone,
            from: '+16476943681'
          }, function(err, message) {
            if (err) {
              logger.info(err);
            } else {
              logger.info(message.sid);
            }
          });
        });

      });
  });
}
