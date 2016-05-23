'use strict';

import mongoose from 'mongoose';

var RoomSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
  roomMates: Array
});

export default mongoose.model('Room', RoomSchema);
