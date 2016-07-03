/**
 * Reminder model events
 */

'use strict';

import {EventEmitter} from 'events';
import Reminder from './reminder.model';
var ReminderEvents = new EventEmitter();
import logger from 'winston';

// Set max event listeners (0 == unlimited)
ReminderEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Reminder.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    logger.info('Emitting reminder model event: ' + event + ':' + doc._id + ':' + doc._creator);
    ReminderEvents.emit(event + ':' + doc._id + ':' + doc._creator, doc);
    ReminderEvents.emit(event, doc);
  }
}

export default ReminderEvents;
