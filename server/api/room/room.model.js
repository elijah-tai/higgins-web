'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var RoomSchema = new mongoose.Schema({
  _creator: {       // id of the owner of the room
    type: Schema.ObjectId,
    ref: 'User'
  },
  name: { // name of room
    type: String,
    trim: true
  },
  address: { // address of room
    type: String,
    trim: true
  },
  active: { // for checking that room is used
    type: Boolean,
    default: true
  },
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
