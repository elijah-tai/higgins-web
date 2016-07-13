'use strict';

import Agenda from 'agenda';
import twilio from 'twilio';
import logger from 'winston';
import User from '../../api/user/user.model';
import Member from '../../api/member/member.model';
import Group from '../../api/group/group.model';
import Task from '../../api/task/task.model';
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

  var task = job.attrs.data;
  logger.info('send notification called ', task);

  // cancel this job, if one-time task
  if (!task.doesRecur) {
    cancelSendNotification(task._id);
  }

  Member.find({_id:  { $in: task.assignees }}).exec()
    .then(members => {
      members.forEach(function(member) {
        client.messages.create({
          body: 'Hey ' + member.name + ', Higgins here! ' + task.creatorName + ' in the group ' + task.groupName + ' would like to know if you were able to complete the task: '+ task.name.charAt(0).toLowerCase() + task.name.slice(1) + '? Please respond "YES ' + task.ref + '" if you have' +
          ' completed the task, and "NO ' + task.ref + '" if you have not. Make sure to include the task' +
          ' reference ID in your response - cheers!',
          to: '+1' + member.phone,
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
agenda.define('schedule task', function(job, done) {
  var task = job.attrs.data;
  logger.info('schedule task called ', task._id);

  // delete this schedule job from the db
  cancelScheduleTask(task._id);

  if (task.doesRecur) {
    var sendNotification = agenda.create('send notification', task);
    switch(task.recurType) {
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
    agenda.now('send notification', task);
  }

  done();
});

// cancel send notifications when task deleted (both send / schedule)
// TODO: or when task updated with new date / recurrence (when implemented)
// TODO: or when task has no members (when implemented)
// TODO: when group is deleted, should call delete tasks (when implemented)
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

function cancelScheduleTask(id) {
  var scheduleTask = {
    'name' : 'schedule task',
    'data._id' : id
  };
  agenda.cancel(scheduleTask, function(err, numRemoved) {
    if (err) {
      logger.error(err);
    } else if (numRemoved) {
      logger.info('cancelled schedule task', id);
    }
  });
}

export function updateSchedule(id, task) {
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
      if ( (job.attrs.data.datetime === task.datetime.toString()) &&
           (job.attrs.data.doesRecur === task.doesRecur) &&
           (job.attrs.data.recurType === task.recurType) ) {
        // logger.info('saved in place');
        job.attrs.data.name = task.name;
        job.attrs.data.assignees = task.assignees;
        job.save(function(err) { if (err) { logger.error(err); } });
      // otherwise recreate it
      } else {
        // logger.info('created new');
        job.remove(function(err) { if (err) { logger.error(err); } });
        var taskObj = task;
        taskObj.id = id;
        createSchedule(taskObj);
      }

    });
  });
}

export function cancelScheduledJobs(id) {
  cancelSendNotification(id);
  cancelScheduleTask(id);
}

export function createSchedule(task) {

  if ( !task || !task.datetime) {
    logger.error('scheduler.createSchedule - task DNE');
    // TODO: should error out
  }

  var when = new Date(task.datetime);

  var taskCreatorName = null,
      groupName = null;

  User.findById( task.creator ).exec()
    .then(user => {
      if ( !user ) {
        logger.error('scheduler.createSchedule - task creator not found');
      }

      taskCreatorName = user.name;

      Group.findById( task.group ).exec()
        .then(group => {

          if ( !group ) {
            logger.error('scheduler.createSchedule - group creator not found');
          }

          groupName = group.name;

          Member.find({_id:  { $in: task.assignees }}).exec()
            .then(members => {

              members.forEach(function(member) {
                client.messages.create({
                  body: 'Hey ' + member.name + ', Higgins here! ' + taskCreatorName + ' in the group ' + groupName + ' would like to know if you\'re able to: '+ task.name.charAt(0).toLowerCase() + task.name.slice(1) + ' by ' + moment(task.datetime).calendar() + '? Please respond "YES ' + task.ref + '" if you can' +
                  ' complete the task, and "NO ' + task.ref + '" if you can\'t. Make sure to include the task' +
                  ' reference ID in your response - cheers!',
                  to: '+1' + member.phone,
                  from: twilioPhoneNum
                }, function(err, message) {
                  if (err) {
                    logger.info(err);
                  } else {
                    logger.info('Task confirmation message sent with message SID: ' + message.sid);
                  }
                });
              });
            });
        });
    });

  agenda.schedule(when, 'schedule task', {
    _id: task.id,
    name: task.name,
    datetime: task.datetime,
    assignees: task.assignees,
    recurType: task.recurType,
    doesRecur: task.doesRecur,
    creatorName: taskCreatorName,
    groupName: groupName,
    active: task.active
  });
}
