/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/tasks              ->  index
 * POST    /api/tasks              ->  create
 * GET     /api/tasks/:id          ->  show
 * PUT     /api/tasks/:id          ->  update
 * DELETE  /api/tasks/:id          ->  destroy
 */

'use strict';

var scheduler = require('../../components/scheduler/scheduler.js');

import _ from 'lodash';
import logger from 'winston';
import Task from './task.model';
import Group from '../group/group.model';
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
        logger.error('error: task update not saved', err)
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

// Gets a list of Tasks
export function index(req, res) {
  return Task.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Task from the DB
export function show(req, res) {
  return Task.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Task in the DB
export function create(req, res) {
  var newTask = new Task(req.body);
  return newTask.save(function(err, task) {
    scheduler.createSchedule(task)
  })
    .then(respondWithResult(res, 201))
    .catch(handleError(res))
}

// Updates an existing Task in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Task.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.params.id, req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Task from the DB
export function destroy(req, res) {
  scheduler.cancelScheduledJobs(req.params.id);

  return Task.findById(req.params.id, function(err, task) {

    Group.update(
      {_id: task._groupId},
      {$pullAll: {tasks: [new mongoose.Types.ObjectId(req.params.id)]}},
      null, function(err, result) {
        if (err) {
          logger.error(err);
        }
        logger.info('`task.controller.destroy` - Task successfully removed from group. Ok status: ' + result.ok);
      });

  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
