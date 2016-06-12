'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var RoommateSchema = new mongoose.Schema({
  _roomId: {        // id of room that roommateModal is attached to
    type: Schema.ObjectId,
    ref: 'Room'
  },
  name: String,     // name of roommateModal
  phone: Number,    // roommateModal phone number
  active: { type: Boolean, default: true }
});

export default mongoose.model('Roommate', RoommateSchema);
