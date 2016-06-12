'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var RoommateSchema = new mongoose.Schema({
  _roomId: {        // id of room that roommate is attached to
    type: Schema.ObjectId,
    ref: 'Room'
  },
  name: String,     // name of roommate
  phone: Number,    // roommate phone number
  active: { type: Boolean, default: true }
});

export default mongoose.model('Roommate', RoommateSchema);
