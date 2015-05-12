'use strict';

// We require cylon and define our robot as usual
var Cylon = require('cylon');

Cylon.robot({
  name: 'peanut-bot',

  connections: {
    arduino: { adaptor: 'intel-iot'}
  },

  devices: {
    led: { driver: 'led', pin: 5 }
  },

  work: function() {
    // Add your robot code here,
    // for this example with socket.io
    // we are going to be interacting
    // with the robot using the code in
    // the client side.
    every((1).second(), this.led.toggle);
  }
});
/*
// We setup the api specifying `socketio`
// as the preffered plugin
Cylon.api(
  'socketio',
  {
  host: '0.0.0.0',
  port: '3000'
});
*/
Cylon.start()