/**
 * Group model events
 */

'use strict';

import {EventEmitter} from 'events';
import Group from './group.model';
var GroupEvents = new EventEmitter();
import logger from 'winston';

// Set max event listeners (0 == unlimited)
GroupEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Group.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    logger.info('Emitting group model event: ' + event + ', doc._id:' + doc._id + ', doc.creator:' + doc.creator);
    GroupEvents.emit(event + ':' + doc._id + ':' + doc.creator, doc);
    logger.info('Emitting group model event: ' + event);
    GroupEvents.emit(event, doc);
  }
}

export default GroupEvents;
