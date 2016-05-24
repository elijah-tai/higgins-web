'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var RoomSchema = new mongoose.Schema({
  _creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  name: String,
  info: String,
  active: Boolean,
  roomMates: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]
});

export default mongoose.model('Room', RoomSchema);
