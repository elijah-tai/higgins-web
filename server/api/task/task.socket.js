/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import TaskEvents from './task.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(socketio) {
  // Bind model events to socket events
  for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener('task:' + event, socketio);

    TaskEvents.on(event, listener);
    socketio.on('disconnect', removeListener(event, listener));
  }
}


function createListener(event, io) {
  return function(doc) {
    io.sockets.in(doc.creator).emit(event + ':' + doc.creator, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    TaskEvents.removeListener(event, listener);
  };
}
