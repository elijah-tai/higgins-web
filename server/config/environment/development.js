'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/higgins-dev'
  },

  // Seed database on startup
  seedDB: true,

  // wj's higgins twilio trial account
  twilio: {
    accountSid: process.env.TWILIO_SID || 'AC02c5de686f22ddabcb12e073004823aa',
    authToken: process.env.TWILIO_AUTH_TOKEN || '5982165a73eee9b02a8c541e53227756',
    phoneNumber: process.env.TWILIO_NUM || '+16475592964'
  }

};
