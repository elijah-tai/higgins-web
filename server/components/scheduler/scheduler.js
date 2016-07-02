import Agenda from 'agenda';
import twilio from 'twilio';
import logger from 'winston';
import Roommate from '../../api/roommate/roommate.model';
import config from '../../config/environment';
var moment = require('moment');

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

  // cancel this job, if one-time reminder
  if (!reminder.doesRecur) {
    cancelSendNotification(reminder._id);
  }

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
  cancelScheduleReminder(reminder._id);

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
function cancelSendNotification(id) {
  var sendNotification = {
    'name' : 'send notification',
    'data._id' : id
  };
  agenda.cancel(sendNotification, function(err, numRemoved) {
    if (err) {
      logger.error(err);
    } else if (numRemoved) {
      logger.info('cancelled send notification', id);
    }
  });
}

function cancelScheduleReminder(id) {
  var scheduleReminder = {
    'name' : 'schedule reminder',
    'data._id' : id
  };
  agenda.cancel(scheduleReminder, function(err, numRemoved) {
    if (err) {
      logger.error(err);
    } else if (numRemoved) {
      logger.info('cancelled schedule reminder', id);
    }
  });
}

export function updateSchedule(id, reminder) {
  // There should only be 1 job for a given id at a time
  agenda.jobs({'data._id': id}, function(err, jobs) {
    jobs.forEach(function(job) {
      logger.info('editing job: ', id);

      // agenda sometimes saves stored datetime as Date object
      if (typeof job.attrs.data.datetime === 'object') {
        job.attrs.data.datetime = job.attrs.data.datetime.toISOString();
      }

      // if the datetime hasnt changed
      // edit this job (regardless of whether it is schedule or send)
      if ( (job.attrs.data.datetime === reminder.datetime.toString()) &&
           (job.attrs.data.doesRecur === reminder.doesRecur) &&
           (job.attrs.data.recurType === reminder.recurType) ) {
        // logger.info('saved in place');
        job.attrs.data.name = reminder.name;
        job.attrs.data.assignees = reminder.assignees;
        job.save(function(err) { if (err) { logger.error(err); } });
      // otherwise recreate it
      } else {
        // logger.info('created new');
        job.remove(function(err) { if (err) { logger.error(err); } });
        var reminderObj = reminder;
        reminderObj.id = id;
        createSchedule(reminderObj)
      }
      
    });
  });
}

export function cancelScheduledJobs(id) {
  cancelSendNotification(id);
  cancelScheduleReminder(id);
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
