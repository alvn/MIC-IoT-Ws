'use strict';

// We require cylon and define our robot as usual
var Cylon = require('cylon');

//LCD Current Text
var currentText = '';     //defining as global var here.

Cylon.robot({
  name: 'peanut-bot',
    
  // This is how we define custom events that will be registered
  // by the API.
  events: ['button_down', 'button_up', 'touch_down', 'touch_up', 'rotary_reading','sound_reading', 'light_reading', 'temp_reading','led_is_on', 'led_is_off', 'led_current_brightness', 'buzzer_is_on', 'buzzer_is_off', 'buzzer_current_level', 'relay_is_on', 'relay_is_off', 'current_text'],
    
  // These are the commands that will be availble in the API
  // Commands method needs to return an object with the aliases
  // to the robot methods.
  commands: function() {
    return {
      led_on: this.ledOn,
      led_off: this.ledOff,
      led_brightness: this.ledBrightness,
      buzzer_on: this.buzzerOn,
      buzzer_off: this.buzzerOff,
      buzzer_level: this.buzzerLevel,
      relay_on: this.relayOn,
      relay_off: this.relayOff,
      screen_write: this.screenWrite,
      screen_line: this.screenLine,
      screen_clear: this.screenClear,
      screen_rgb: this.screenRGB,
      servo_move: this.servoMove,
      status_check: this.statusCheck
    };
  },

  connections: {
    arduino: { adaptor: 'intel-iot'}
  },

  devices: {
    screen: {driver:'upm-jhd1313m1'},
    relay: { driver: 'motor', pin: 2 },
    servo: { driver: 'servo', pin: 3 },
    led: { driver: 'led', pin: 5 },
    buzzer: { driver: 'motor', pin: 6 },
    button: { driver: 'button', pin: 7 },
    touch: { driver: 'button', pin: 8 },
    rotary: { driver: 'analog-sensor', pin: 0, lowerLimit: 0, upperLimit: 1024 },
    sound: { driver: 'analog-sensor', pin: 1, lowerLimit: 0, upperLimit: 1024 },
    temp: { driver: 'analog-sensor', pin: 2, lowerLimit: 0, upperLimit: 1024 },
    light: { driver: 'analog-sensor', pin: 3, lowerLimit:0, upperLimit: 1024 }

  },

  work: function() {
    // Add your robot code here,
          
    //buttons
    this.button.on('push', function() {
      console.log('detected press');
      this.emit('button_down');
    }.bind(this));

    this.button.on('release', function() {
	   console.log('touch released');
       this.emit('button_up');
    }.bind(this));
      
    this.touch.on('push', function() {
      console.log('detected press');
      this.emit('touch_down');
    }.bind(this));

    this.touch.on('release', function() {
	   console.log('touch released');
      this.emit('touch_up');
    }.bind(this));
      
    //Servo
    var servoAngle = 0;
    this.servo.on('angle', function(angle) {
       this.emit('servo_angle', this.servo.currentAngle);
    }.bind(this));
      
    //ANALOG INPUTS
      
    //rotary
    var rotaryVal = 0;
    this.rotary.on('analogRead', function(data) {
      rotaryVal = data;
        
        //convert raw rotary value to angel 300 degrees total
        rotaryVal = (rotaryVal).fromScale(0, 1024).toScale(0, 300);
        //Get rid of decimal points
        rotaryVal = rotaryVal.toFixed(0).toString();
        
      console.log("Reading: " + rotaryVal);
      this.emit('rotary_reading', rotaryVal); 
    }.bind(this));
      
    //sound
    var soundVal = 0;
     this.sound.on('analogRead', function(data) {
      soundVal = data;
        
      soundVal = soundVal.toFixed(0).toString();
        
      this.emit('sound_reading', soundVal); 
     }.bind(this));
    
              
    //temp
    var tempVal = 0;
    var resistance = 0;
    var temperature = 0;
    var B = 3975;                  //B value of the thermistor
    this.temp.on('analogRead', function(data) {
      tempVal = data;
      resistance=(1023-tempVal)*10000/tempVal; //get the resistance of the sensor;
      tempVal=1/(Math.log(resistance/10000)/B+1/298.15)-273.15;//convert to temperature via datasheet ;
      tempVal = tempVal.toFixed(0).toString();

      this.emit('temp_reading', tempVal);
     }.bind(this));
    

    //light
    var lightVal = 0;
     this.light.on('analogRead', function(data) {
      lightVal = data;
    
      lightVal = lightVal.toFixed(0).toString();
        
      this.emit('light_reading', lightVal);
     }.bind(this));
      
  },
  
  //COMMAND METHODS
 
 //Led Methods
  ledOn: function() {
    this.led.turnOn();
    this.emit('led_is_on');
  },

  ledOff: function() {
    this.led.turnOff();
    this.emit('led_is_off');
  },
 
  ledBrightness: function(level) {
    var level = Number(level);
    this.led.brightness(level);
    this.emit('led_current_brightness', this.led.currentBrightness());
  },
    
 //Buzzer Methods
 buzzerOn: function() {
     this.buzzer.turnOn();
     this.emit('buzzer_is_on');
 },

 buzzerOff: function() {
     this.buzzer.turnOff();
     this.emit('buzzer_is_off');
 },
 
 buzzerLevel: function(level) {
     this.buzzer.speed(level);
     this.emit('buzzer_current_level', this.buzzer.currentSpeed());
 },
    
 //Relay Methods
 relayOn: function() {
     this.relay.turnOn();
     this.emit('relay_is_on');
 },

 relayOff: function() {
     this.relay.turnOff();
     this.emit('relay_is_off');
 },

 //Screen Methods
 screenWrite: function(msg) {
  this.screen.setCursor(0,0);
  this.screen.write(msg);
  this.emit('current_text', msg);
  currentText = msg;
 },

 screenLine: function(line) {
  this.screen.setCursor(line,0);
 },
    
 screenScroll: function() {
  this.screen.scroll(true);
 },    
    
 screenClear: function() {
  this.screen.clear();
 },

 screenRGB: function() {
  this.screen.setColor(200,120,20);
 },
 
 //Servo Method
 servoMove: function() {
     //if (angle >= 0 && angle <= 135 ) {
     var angle = 100;   
     this.servo.angle(angle);
        //this.emit('servo_angle', servo.angle);
    //}
 },

//Status Check on Connection
 statusCheck: function() {
     //led status
      if (this.led.isOn()) {
          this.emit('led_is_on');
      } else {
          this.emit('led_is_off');
      }
      
      this.emit('led_current_brightness', this.led.currentBrightness());
      
     //buzzer status
      if (this.buzzer.isOn) {
          this.emit('buzzer_is_on');
      } else {
          this.emit('buzzer_is_off');
      }
      
      this.emit('buzzer_current_level', this.buzzer.currentSpeed());
     
     //Button status
      if (this.button.isPressed()) {
          this.emit('button_down');
      } else {
          this.emit('button_up');
      }
     
     //Touch status
      if (this.button.isPressed()) {
          this.emit('touch_down');
      } else {
          this.emit('touch_up');
      }
     
     //LCD Text Update
      this.emit('current_text', currentText);

  }
    
});

// We setup the api specifying `socketio`
// as the preffered plugin
Cylon.api(
  'socketio',
  {
  host: '0.0.0.0',
  port: '3000'
});

Cylon.start();