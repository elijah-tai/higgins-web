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

  // marcus' twilio
  twilio: {
    accountSid: process.env.TWILIO_SID || 'AC70abbc05fb5e7b78cd2911ac25dfbba7',
    authToken: process.env.TWILIO_AUTH_TOKEN || '9b146d3650cc25bad0e9843814cd5820',
    phoneNumber: process.env.TWILIO_NUM || '+15817013265'
  }

};
