Looping example from Nicen Jehr:

http://www.reddit.com/r/Music/comments/21cs3i/fun_beat_mixer_in_your_browser_just_press_keys_on/cgcfxxg

i wrote a script to loop stuff. it's hardcoded to loop every 4 beats at 120bpm. it's easiest to time your keypresses right with the backing beat, so go to the clap page. The groove page uses a 90bpm beat so it won't sound as good unless you change the bpm variable.
Paste the below script into your F12 console and press enter. (Since the page intercepts the F12 keypress here's an alternate way to get the console: Right click the page; click Inspect Element; click the Console tab.)
Press delete to clear your looped beats.
It seems to desync a bit sometimes but most of the time it sounds fine? I can confirm that Firefox delays the input enough to be irritating, chrome is perfect.
also i got confused as HELL when I was experimenting with spacebar and wasn't yet aware that it changed the binds!

    // (c) 2014 Nicen Jehr
    // Do what you want with this code under the MIT license
    // http://opensource.org/licenses/MIT

    var bpm = 120;
    // Keep track of setInterval functions for future removal:
    var setIntervals = [];
    function stopLoop(){
      console.log("Stopping loop");
      while(setIntervals.length > 0){
        interval = setIntervals.shift();
        clearInterval(interval);
      }
    }

    // Variable to keep track of whether a particular keypress is real
    // (to be looped) or simulated:
    var isSimulated = false;

    function onKeyDown(e){
      // Stop looping on "delete" key press:
      if(e.which == 46){
        stopLoop();
        isSimulated = false;
        return false;
      }

      // Don't trigger extra repetitions for looped keypresses:
      if(isSimulated){
        isSimulated = false;
        return false;
      };

      var interval = window.setInterval(
        function(){
          console.log('Pressing',e.which)
          simulateKeypress(e.which)
        },
        (4*1000*60/bpm)
      )
      // ^ Four times the milliseconds per beat (one measure)
      setIntervals.push(interval);
    }

    function simulateKeypress(which){
      var e = jQuery.Event("keydown");
      e.which = which; // # Some key code value
      isSimulated = true;
      $(window).trigger(e);
    }

    $(window).on('keydown', onKeyDown);