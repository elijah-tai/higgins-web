'use strict';

import logger from 'winston';
import twilio from 'twilio';
import config from '../../config/environment';
import Task from '../../api/task/task.model';
import Member from '../../api/member/member.model';

module.exports = function(req, res) {
  if (twilio.validateExpressRequest(req, config.twilio.authToken)) {

    var twiml = new twilio.TwimlResponse();

    if ( !req.body || !req.body.Body || !req.body.From ) {
      logger.error('No req.body or req.body.Body or req.body.From ');
      res.status( 400 ).send('Error in response from twilio.');
    }

    var userResponse = req.body.Body,
        tokenizedResponse = userResponse.match(/\S+/g),
        userPhone = req.body.From,
        taskRef;

    logger.info( 'Text received from ' + userPhone + ': ' + userResponse );

    if ( tokenizedResponse.length === 2 ) {

      if ( tokenizedResponse.indexOf('YES') > -1 ) {

        taskRef = tokenizedResponse[1];

        Member.findOne({ phone: userPhone.slice(2) }, function( err, member ) {

          logger.info('YES answer received for task: ' + taskRef + ' from member: ' + member.name );

          if (!!err) {
            logger.error( 'twilio.Member.findOne: Could not find member ' + err );
          }

          Task.update({ ref: taskRef, 'report.assignee': member._id }, {
            $set: {
              'report.$.status': 'accepted'
            }
          }, function( err, numAffected ) {
            if ( !!err ) {
              logger.error('twilio.Task.update error: ' + err );
            }

            logger.info('Task ' + taskRef + ' changed to accepted for user ' + member._id + numAffected);
            twiml.message('YES answer received for the task reference: ' + taskRef + ', I\'ll notify the task' +
              ' creator!');

            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
          });

        });

      }
      else if ( tokenizedResponse.indexOf('NO') > -1 ) {

        taskRef = tokenizedResponse[1];

        Member.findOne({ phone: userPhone.slice(2) }, function( err, member ) {

          logger.info('NO answer received for task: ' + taskRef + ' from member: ' + member.name );

          if (!!err) {
            logger.error( 'twilio.Member.findOne: Could not find member ' + err );
          }

          Task.update({ ref: taskRef, 'report.assignee': member._id }, {
            $set: {
              'report.$.status': 'rejected'
            }
          }, function( err, numAffected ) {
            if ( !!err ) {
              logger.error('twilio.Task.update error: ' + err );
            }

            logger.info('Task ' + taskRef + ' changed to rejected for user ' + member._id + JSON.stringify(numAffected));
            twiml.message('NO answer received for the task reference: ' + taskRef + ', I\'ll notify the task creator!');
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
          });

        });

      }
      else {

        twiml.message('Sorry - can you resend the message with the correct response?');
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());

      }
    }
    else {

      twiml.message('Sorry - can you resend the message with the correct response?');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());

    }
  }
  else {
    res.status(403).send('You\'re not Twilio!');
  }
};

// go to task, change status to confirmed/rejected based on first response (if rejected, then cancel task in scheduler)
// second message - change status to finished/unfinished based on response
