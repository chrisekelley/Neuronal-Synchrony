$(function() {

	//	little rec/stop/pause buttons 
	//	Albino Tonnina 
	//	http://www.albinotonnina.com
    //	Do what you want with this code under the MIT license
    //	http://opensource.org/licenses/MIT


    var is_recording = false;
    var stoppath = "M21.545,10.917v10.165c0,0.125-0.046,0.234-0.137,0.326c-0.092,0.091-0.2,0.137-0.326,0.137H10.917c-0.125,0-0.233-0.047-0.325-0.137c-0.092-0.092-0.137-0.201-0.137-0.326V10.917c0-0.125,0.045-0.233,0.137-0.325c0.091-0.091,0.2-0.137,0.325-0.137h10.165c0.126,0,0.234,0.045,0.326,0.137C21.499,10.684,21.545,10.792,21.545,10.917z"
    $('#credits ul').append('<li><div id="loops" /></li>');
    $('<svg version="1.1" id="lp_recpause" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="8 8 16 16" enable-background="new 8 8 16 16" xml:space="preserve"><circle fill="#cccccc" cx="16" cy="16" r="6"/>"/>').appendTo('#loops');
    $('<svg version="1.1" style="display:none" id="lp_stop" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="8 8 16 16" enable-background="new 8 8 16 16" xml:space="preserve"><rect x="10.75" y="10.125" width="10.5" height="10.5" fill="#cccccc" /></svg>').appendTo('#loops');
    $('<input/>').attr({ type: 'text', size: '4', id: 'bpm', name: 'bpm', value: '120'}).appendTo('#loops');



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

    function onKeyDown(e) {
        //console.log("keydown");
        if (e.target.id === 'bpm') {
          var input = $( "#bpm" );
          if (e.which >= 48 && e.which <= 57) {
            var res = String.fromCharCode(e.which);
            input.val( input.val() + res );
          }
          if (e.which == 8) {
            var bpmValue = input.val();
            if (bpmValue.length > 0) {
              bpmValue = bpmValue.substring(0, bpmValue.length-1);
              input.val(bpmValue);
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
          bpm = bpmInput.val();
          console.log("Current bpm: " + bpm);
          var interval = window.setInterval(function() {
                //console.log('Pressing', e.which)
                simulateKeypress(e.which)
            }, (4 * (sec * 1000) * 60 / bpm))
            // ^ Four times the milliseconds per beat (one measure)
            curpat.intervals.push(interval)
        }
    }

    function simulateKeypress(which) {
        var e = jQuery.Event("keydown");
        e.which = which; // # Some key code value
        isSimulated = true;
        $(window).trigger(e);
    }
    $(window).on('keydown', onKeyDown);
    $('#lp_recpause').bind('click', {}, function(event) {
        $('#lp_stop').show();
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
