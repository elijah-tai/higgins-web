/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/reminders              ->  index
 * POST    /api/reminders              ->  create
 * GET     /api/reminders/:id          ->  show
 * PUT     /api/reminders/:id          ->  update
 * DELETE  /api/reminders/:id          ->  destroy
 */

'use strict';

var scheduler = require('../../components/scheduler/scheduler.js');

import _ from 'lodash';
import logger from 'winston';
import Reminder from './reminder.model';
import Room from '../room/room.model';
import mongoose from 'mongoose';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
      return res;
    }
  };
}

function saveUpdates(id, updates) {
  return function(entity) {
    var updated = _.extend(entity, updates);
    return updated.save(function(err) {
      if (err) {
        logger.error('error: reminder update not saved', err)
      } else {
        scheduler.updateSchedule(id, updates);
      }
    })
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
          return res;
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Reminders
export function index(req, res) {
  return Reminder.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Reminder from the DB
export function show(req, res) {
  return Reminder.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Reminder in the DB
export function create(req, res) {
  var newReminder = new Reminder(req.body);
  return newReminder.save(function(err, reminder) {
    scheduler.createSchedule(reminder)
  })
    .then(respondWithResult(res, 201))
    .catch(handleError(res))
}

// Updates an existing Reminder in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Reminder.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.params.id, req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Reminder from the DB
export function destroy(req, res) {
  scheduler.cancelScheduledJobs(req.params.id);

  return Reminder.findById(req.params.id, function(err, reminder) {

    Room.update(
      {_id: reminder._roomId},
      {$pullAll: {reminders: [new mongoose.Types.ObjectId(req.params.id)]}},
      null, function(err, result) {
        if (err) {
          logger.error(err);
        }
        logger.info('`reminder.controller.destroy` - Reminder successfully removed from room. Ok status: ' + result.ok);
      });

  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
