'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var RoommateSchema = new mongoose.Schema({
  _roomId: {        // id of room that roommate is attached to
    type: Schema.ObjectId,
    ref: 'Room'
  },
  _creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    trim: true
  },     // name of roommate
  phone: {
    type: Number
  },    // roommate phone number
  active: { type: Boolean, default: true }
});

export default mongoose.model('Roommate', RoommateSchema);
