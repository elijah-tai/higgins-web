/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/roomMates              ->  index
 * POST    /api/roomMates              ->  create
 * GET     /api/roomMates/:id          ->  show
 * PUT     /api/roomMates/:id          ->  update
 * DELETE  /api/roomMates/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import RoomMate from './roomMate.model';
import logger from 'winston';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
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

// Gets a list of RoomMates
export function index(req, res) {
  return RoomMate.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single RoomMate from the DB
export function show(req, res) {
  return RoomMate.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new RoomMate in the DB
export function create(req, res) {
  return RoomMate.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing RoomMate in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return RoomMate.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a RoomMate from the DB
export function destroy(req, res) {
  return RoomMate.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
