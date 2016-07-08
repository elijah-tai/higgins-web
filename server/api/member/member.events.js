/**
 * Member model events
 */

'use strict';

import {EventEmitter} from 'events';
import Member from './member.model';
var MemberEvents = new EventEmitter();
import logger from 'winston';

// Set max event listeners (0 == unlimited)
MemberEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Member.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    logger.info('Emitting member model event: ' + event + ':' + doc._id + ':' + doc._creator);
    MemberEvents.emit(event + ':' + doc._id + ':' + doc._creator, doc);
    MemberEvents.emit(event, doc);
  }
}

export default MemberEvents;
