'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var RoomSchema = new mongoose.Schema({
  _creator: {       // id of the owner of the room
    type: Schema.ObjectId,
    ref: 'User'
  },
  name: String,     // name of room
  address: String,  // address of room
  active: { type: Boolean, default: true }, // for checking that room is used
  roomMates: [{     // array of roommates that share the room
    type: Schema.ObjectId,
    ref: 'RoomMate'
  }],
  reminders: [{     // array of reminders attached to room
    type: Schema.ObjectId,
    ref: 'Reminder'
  }]
});

export default mongoose.model('Room', RoomSchema);
