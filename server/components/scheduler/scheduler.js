import Agenda from 'agenda';
import twilio from 'twilio';
import logger from 'winston';
import Roommate from '../../api/roommate/roommate.model';
import config from '../../config/environment';

var agenda = new Agenda(
  {
    db:
      {
        address: config.mongo.uri,
        collection: 'agenda',
        options: config.mongo.options
      }
  }
);

var accountSid = config.twilio.accountSid;
var authToken = config.twilio.authToken;
var twilioPhoneNum = config.twilio.phoneNumber;
var client = new twilio.RestClient(accountSid, authToken);

agenda.on('ready', function() {
  agenda.processEvery('5 seconds');
  agenda.start();
  logger.info('Agenda Process Starting!');
});

agenda.define('send notification', function(job, done) {
  var reminder = job.attrs.data;
  logger.info('send notification called ', reminder);

  // comment while testing locally
  Roommate.find({_id:  { $in: reminder.assignees }}).exec()
    .then(roommates => {
      roommates.forEach(function(roommate) {
        client.messages.create({
          body: 'Hey ' + roommate.name + '! Higgins here, just reminding you to ' + reminder.name.charAt(0).toLowerCase() + reminder.name.slice(1),
          to: '+1' + roommate.phone,
          from: twilioPhoneNum
        }, function(err, message) {
          if (err) {
            logger.info(err);
          } else {
            logger.info(message.sid);
          }
        });
      });
    }, done);
});

// call this function on the date
agenda.define('schedule reminder', function(job, done) {
  var reminder = job.attrs.data;
  logger.info('schedule reminder called ', reminder._id);

  // delete this schedule job from the db
  var thisJob = {
    'name' : 'schedule reminder',
    'data._id' : reminder._id
  };
  agenda.cancel(thisJob, function(err, numRemoved) {
    if (err) {
      logger.error(err);
    } else if (numRemoved) {
      logger.info('cancelled schedule reminder', reminder._id);
    }
  });

  if (reminder.doesRecur) {
    var sendNotification = agenda.create('send notification', reminder);
    switch(reminder.recurType) {
      case 'Daily':
        sendNotification.repeatEvery('1 days');
        sendNotification.save();
        break;
      case 'Weekly':
        sendNotification.repeatEvery('1 weeks');
        sendNotification.save();
        break;
      case 'Monthly':
        sendNotification.repeatEvery('1 months');
        sendNotification.save();
        break;
      case 'Yearly':
        sendNotification.repeatEvery('1 years');
        sendNotification.save();
        break;
    }
  } else {
    agenda.now('send notification', reminder);
  }

  done();
});

// cancel send notifications when reminder deleted (both send / schedule)
// TODO: or when reminder updated with new date / recurrence (when implemented)
// TODO: or when reminder has no roommates (when implemented)
// TODO: when room is deleted, should call delete reminders (when implemented)
export function cancelScheduledJobs(id) {
  var scheduleReminder = {
      'name' : 'schedule reminder',
      'data._id' : id
    },
    sendNotification = {
      'name' : 'send notification',
      'data._id' : id
    };
  agenda.cancel(scheduleReminder, function(err, numRemoved) {
    if (err) {
      logger.error(err);
    } else if (numRemoved) {
      logger.info('cancelled schedule reminder', id);
    }
  });
  agenda.cancel(sendNotification, function(err, numRemoved) {
    if (err) {
      logger.error(err);
    } else if (numRemoved) {
      logger.info('cancelled send notification', id);
    }
  });
}

export function createSchedule(reminder) {
  var when = new Date(reminder.datetime);

  var reminderObj = {
    _id: reminder.id,
    name: reminder.name,
    datetime: reminder.datetime,
    assignees: reminder.assignees,
    recurType: reminder.recurType,
    doesRecur: reminder.doesRecur,
    active: reminder.active
  };

  agenda.schedule(when, 'schedule reminder', reminderObj);
}
