 //Global Vars
    var device;

    //Global Input Vars
    var button = false;
    var touch = false;
    var relay = false;
    var rotary = 0;
    var temp = 0;
    var light = 0;
    var sound = 0;

    //Global Output Vars
    var led = false;
    var led_brightness = 0;
    var buzzer = false;
    var buzzer_level = 0;
    var lcd = false;
    var lcd_text = '';
    var lcd_rgb = {red:255, green: 255, blue: 255};

    window.onload = function() {
      // We connect to the device defined in the robot
      robot = io('http://burrito.local:3000/api/robots/micbot');
      //servo = io('http://192.168.1.176:3000/api/robots/peanut-bot/devices/sensor');

      //set initial status
      robot.emit('status_check');

      //EVENT LISTENERS

      //Button Press
      robot.on('button_down', function(){
        $('#status-Button').html('I Am ON');
      });

      robot.on('button_up', function(){
        $('#status-Button').html('I Am OFF');
      });

      //Touch Sensor Press
      robot.on('touch_down', function(){
        $('#status-Touch').html('I Am Touched');
      });

      robot.on('touch_up', function(){
        $('#status-Touch').html('I Am NOT Touched');
      });

      //Rotary Sensor
      robot.on('rotary_reading', function(data){
        $('#status-Rotary').html($('<li>').text(data));
      });

      //Sound Sensor
      robot.on('sound_reading', function(data){
        $('#status-Sound').html($('<li>').text(data));
      });

      //Temp Sensor
      robot.on('temp_reading', function(data){
        $('#status-Temp').html($('<li>').text(data));
      });

      //Light Sensor
      robot.on('light_reading', function(data){
        $('#status-Light').html($('<li>').text(data));
      });

      //LED Update
      robot.on('led_is_on', function(){
          $('#button-LED').html('Turn LED Off');
          $('#button-LED').addClass('status-on');
          $('#button-LED').removeClass('status-off');
      });

      robot.on('led_is_off', function(){
          $('#button-LED').html('Turn LED On');
          $('#button-LED').addClass('status-off');
          $('#button-LED').removeClass('status-on');
      });

      //Relay Update
      robot.on('relay_is_on', function(){
          $('#button-Relay').html('Turn Relay Off');
          $('#button-Relay').addClass('status-on');
          $('#button-Relay').removeClass('status-off');
      });

      robot.on('relay_is_off', function(){
          $('#button-Relay').html('Turn Relay On');
          $('#button-Relay').addClass('status-off');
          $('#button-Relay').removeClass('status-on');
      });

      //Buzzer Update
      robot.on('buzzer_is_on', function(){
          $('#button-Buzzer').html('Turn Buzzer Off');
          $('#button-Buzzer').addClass('status-on');
          $('#button-Buzzer').removeClass('status-off');
      });

      robot.on('buzzer_is_off', function(){
          $('#button-Buzzer').html('Turn Buzzer On');
          $('#button-Buzzer').addClass('status-off');
          $('#button-Buzzer').removeClass('status-on');
      });

      //LCD Update
      robot.on('current_text', function(msg){
          $('#current-Text').html(msg);
      });

      //LCD Backlight Color Update
      robot.on('screen_rgb', function(rgb){
          $('#screen-Red').val(rgb.red);
          $('#screen-Green').val(rgb.green);
          $('#screen-Blue').val(rgb.blue);
      });

      //Backlight Status Update
      robot.on('backlight_on', function(){
          $('#button-Backlight').html('Turn Backlight Off');
          $('#button-Backlight').addClass('status-on');
          $('#button-Backlight').removeClass('status-off');
      });

      robot.on('backlight_off', function(){
          $('#button-Backlight').html('Turn Backlight On');
          $('#button-Backlight').addClass('status-off');
          $('#button-Backlight').removeClass('status-on');
      });


      //OUTPUTS

      //LED
      $('#button-LED').on("click", function(){


        if ( $(this).hasClass("status-off") ) {
          $(this).html('Turn LED Off');
          $(this).addClass('status-on');
          $(this).removeClass('status-off');
          robot.emit('led_on');
        }
        else if ( $(this).hasClass("status-on") ){
          $(this).html('Turn LED On');
          $(this).addClass('status-off');
          $(this).removeClass('status-on');
          robot.emit('led_off');
        }

      });

      //set led brightness level
      $('#level-LED').on("change", function() {
        if ( $('#button-LED').hasClass("status-on") ) {
        }
      });

      //Buzzer
      $('#button-Buzzer').on("click", function(){
        

        if ( $(this).hasClass("status-off") ) {
          $(this).html('Turn Buzzer Off');
          $(this).addClass('status-on');
          $(this).removeClass('status-off');
          robot.emit('buzzer_on');
        }
        else {
          $(this).html('Turn Buzzer On');
          $(this).addClass('status-off');
          $(this).removeClass('status-on');
          robot.emit('buzzer_off');


        }

      });


      //Relay
      $('#button-Relay').on("click", function(){

        if ( $(this).hasClass("status-off") ) {
          $(this).html('Turn Relay Off');
          $(this).addClass('status-on');
          $(this).removeClass('status-off');
          robot.emit('relay_on');
        }
        else {
          $(this).html('Turn Relay On');
          $(this).addClass('status-off');
          $(this).removeClass('status-on');
          robot.emit('relay_off');
        }

      });

      //Servo Toggle
      $('#button-Servo').on("click", function(){

        if ( $(this).hasClass("status-off") ) {
          $(this).html('Move Backward');
          $(this).addClass('status-on');
          $(this).removeClass('status-off');
          robot.emit('servo_forward');
        }
        else {
          $(this).html('Move Forward');
          $(this).addClass('status-off');
          $(this).removeClass('status-on');
          robot.emit('servo_backward');
        }

      });

      //LCD
      $('form').submit(function(e){
        robot.emit('screen_clear');
        robot.emit('screen_write', $('#screen').val());
      $('#screen').val('');
      return false;
      });

      $('#submit-btn').on("click", function(){
        robot.emit('screen_clear');
        robot.emit('screen_write', $('#screen').val());
      $('#screen').val('');
      return false;
      });

      //LCD Backlight Toggle 
      $('#button-Backlight').on("click", function(){

        if ( $(this).hasClass("status-off") ) {
          $(this).html('Turn Backlight Off');
          $(this).addClass('status-on');
          $(this).removeClass('status-off');
          robot.emit('backlight_on');
        }
        else {
          $(this).html('Turn Backlight On');
          $(this).addClass('status-off');
          $(this).removeClass('status-on');
          robot.emit('backlight_off');
        }

      });

      //Change LCD Backlight Color
      $('#screen-Red').on("change", function(){
          lcd_rgb.red = parseInt($('#screen-Red').val());
          robot.emit('screen_rgb', lcd_rgb);
      });

      $('#screen-Green').on("change", function(){
          lcd_rgb.green = parseInt($('#screen-Green').val());
          robot.emit('screen_rgb', lcd_rgb);
      });

      $('#screen-Blue').on("change", function(){
          lcd_rgb.blue = parseInt($('#screen-Blue').val());
          robot.emit('screen_rgb', lcd_rgb);
      });

    };