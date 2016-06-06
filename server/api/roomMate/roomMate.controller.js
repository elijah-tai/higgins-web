/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/roommates              ->  index
 * POST    /api/roommates              ->  create
 * GET     /api/roommates/:id          ->  show
 * PUT     /api/roommates/:id          ->  update
 * DELETE  /api/roommates/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Roommate from './roommate.model';
import logger from 'winston';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
      return res;
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.extend(entity, updates);
    return updated.save()
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

// Gets a list of Roommates
export function index(req, res) {
  return Roommate.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Roommate from the DB
export function show(req, res) {
  return Roommate.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Roommate in the DB
export function create(req, res) {
  return Roommate.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Roommate in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Roommate.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Roommate from the DB
export function destroy(req, res) {
  return Roommate.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
