'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var RoomMateSchema = new mongoose.Schema({
  _roomId: {
    type: Schema.ObjectId,
    ref: 'Room'
  },
  name: String,
  phone: Number,
  info: String,
  active: Boolean
});

export default mongoose.model('RoomMate', RoomMateSchema);
