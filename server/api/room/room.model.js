'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var RoomSchema = new mongoose.Schema({
  _creator: {       // id of the owner of the room
    type: Schema.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    trim: true
  },     // name of room
  address: {
    type: String,
    trim: true
  },  // address of room
  active: {
    type: Boolean,
    default: true
  }, // for checking that room is used
  roommates: [{     // array of roommates that share the room
    type: Schema.ObjectId,
    ref: 'Roommate'
  }],
  reminders: [{     // array of reminders attached to room
    type: Schema.ObjectId,
    ref: 'Reminder'
  }]
});

export default mongoose.model('Room', RoomSchema);
