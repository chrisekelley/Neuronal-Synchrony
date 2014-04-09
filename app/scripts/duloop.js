$(function() {

  Duloop =  {}
	//	little rec/stop/pause buttons 
	//	Albino Tonnina 
	//	http://www.albinotonnina.com
    //	Do what you want with this code under the MIT license
    //	http://opensource.org/licenses/MIT


    var is_recording = false;


  // http://www.reddit.com/r/Music/comments/21cs3i/fun_beat_mixer_in_your_browser_just_press_keys_on/cgcfxxg
    // originally from (c) 2014 Nicen Jehr
    // Do what you want with this code under the MIT license
    // http://opensource.org/licenses/MIT
    var bpm = 120;
    var bpmInput = $( "#bpm" );
    bpm = bpmInput.val();
    var sec = 2;
    var pat = [];
    // Keep track of setInterval functions for future removal:
    function stopLoop() {
        //console.log("Stopping loop");
        for (var z = 0; z < pat.length; z++) {
            while (pat[z].intervals.length > 0) {
                interval = pat[z].intervals.shift();
                clearInterval(interval);
            };
            pat.shift();
        };
    }
    // Variable to keep track of whether a particular keypress is real 
    // (to be looped) or simulated:
    var isSimulated = false;

  Duloop.onKeyDown = function(e) {
        //console.log("keydown");
    var bpmInput = $( "#bpmInput" );

    if (e.target.id === 'bpmInput') {
//          var input = $( "#bpm" );
          if (e.which >= 48 && e.which <= 57) {
            var res = String.fromCharCode(e.which);
            bpmInput.val( bpmInput.val() + res );
            var bpmChange = window.setTimeout(function() {
              var tempo = bpmInput.val();
              NeuronalSynchrony.clock.timeStretch(NeuronalSynchrony.clock._events, tempo / bpm)
              console.log("setting tempo to: " + tempo + "/" + bpm)
              bpm = bpmInput.val();
            }, (2000))
          }
          if (e.which == 8) {
            var bpmValue = bpmInput.val();
            if (bpmValue.length > 0) {
              bpmValue = bpmValue.substring(0, bpmValue.length-1);
              bpmInput.val(bpmValue);
            }
          }
        }

        // Stop looping on "delete" key press:
        // changed from 46
        if (e.which == 8) {
            stopLoop();
            isSimulated = false;
            return false;
        }
        // Don't trigger extra repetitions for looped keypresses:
        if (isSimulated) {
            isSimulated = false;
            return false;
        };
        if (is_recording) {
          // ignore when setting bpm
          if (e.target.id === 'bpm') {
            return false;
          }
          // ignore the tab
          if (e.which == 9 || e.which == 91) {
            return false;
          }
          bpm = bpmInput.val();
          console.log("Current bpm: " + bpm + "at NeuronalSynchrony.beatCount: " + NeuronalSynchrony.beatCount);
          NeuronalSynchrony.startBeat('graphics', NeuronalSynchrony.beatCount, e.which, false);
//          var interval = window.setInterval(function() {
//                simulateKeypress(e.which)
//            }, (4 * (sec * 1000) * 60 / bpm))
//            // ^ Four times the milliseconds per beat (one measure)
//            curpat.intervals.push(interval)
        }
    }

  Duloop.simulateKeypress = function(which) {
        var e = jQuery.Event("keydown");
        e.which = which; // # Some key code value
        isSimulated = true;
        $(window).trigger(e);
    }
    $(window).on('keydown', Duloop.onKeyDown);

    $('#lp_recpause').bind('click', {}, function(event) {
        $('#lp_stop').show();
        $('#new_seq_button').show();
//        $('#play_seq_button').show();
        if (is_recording) {
            is_recording = false;
            $(event.target).attr('fill', '#cccccc');
        } else {
            is_recording = true;
            curpat = {
                sec: 2,
                intervals: []
            };
            pat.push(curpat);
            $(event.target).attr('fill', 'red');
        }
    });
    $('#lp_stop').bind('click', {}, function(event) {
        $('#lp_recpause circle').attr('fill', '#cccccc');
        is_recording = false;
        stopLoop();
    });



});
