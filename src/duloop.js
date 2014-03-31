$(function() {

  var SEQ = {}

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
    $('#credits ul').append('<li><div id="bpmSettings" /></li>');
    $('<label for="bpm">bpm: </label>').appendTo('#bpmSettings');
    $('<input/>').attr({ type: 'text', size: '4', id: 'bpm', name: 'bpm', value: '120'}).appendTo('#bpmSettings');
    $('#credits ul').append('<li><div id="sequencerText-menu" /></li>');
    $('<span id="metro_trigger">&#9833</span> <span id="signature"></span>/4 drum pattern, tempo <span id="tempo"></span> BPM').appendTo('#sequencerText-menu');
    $('#credits ul').append('<li><div id="sequencerbox" /></li>');
    $('<table id="pattern"><tr data-track="hihat"></tr><tr data-track="graphics"></tr></table>').appendTo('#sequencerbox');


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
//          var input = $( "#bpm" );
          if (e.which >= 48 && e.which <= 57) {
            var res = String.fromCharCode(e.which);
            bpmInput.val( bpmInput.val() + res );
            var bpmInterval = window.setTimeout(function() {
              tempo = bpmInput.val();
              clock.timeStretch([event.clock._events], tempo / bpm)
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
          bpm = bpmInput.val();
          console.log("Current bpm: " + bpm + "at SEQ.beatCount: " + SEQ.beatCount);
          startBeat('graphics', SEQ.beatCount, e.which);
//          var interval = window.setInterval(function() {
//                simulateKeypress(e.which)
//            }, (4 * (sec * 1000) * 60 / bpm))
//            // ^ Four times the milliseconds per beat (one measure)
//            curpat.intervals.push(interval)
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

  // Metronome UI

  var mute_metronome = true;


  $('#sequencerText-menu').bind('click', {}, function(event) {
    if (mute_metronome) {
      mute_metronome = false;
      $('#metro_trigger')[0].style.color = '#000000';
    } else {
      mute_metronome = true;
      $('#metro_trigger')[0].style.color = 'red';
    }
  });

  // Function for moving the beat cursor
  SEQ.beatCount = -1;
  var uiNextBeat = function() {
    SEQ.beatCount = (SEQ.beatCount + 1) % signature
    //console.log("beatCount: " + SEQ.beatCount);
    $('#pattern td').removeClass('active')
    $('#pattern td:nth-child('+(SEQ.beatCount+1)+')').addClass('active')
  }


  var context = typeof AudioContext === 'undefined' ? new webkitAudioContext() : new AudioContext()
    , soundBank = {}, beats = {}
//  , tempo = QUERY.tempo || 120
    , tempo = QUERY.tempo ||  bpmInput.val()
    , signature = QUERY.signature || 4
    , beatDur = 60/tempo, barDur = signature * beatDur
    , clock = new WAAClock(context, {toleranceEarly: 0.1})

// The following code highlights the current beat in the UI by calling the function `uiNextBeat` periodically.
  var event = clock.callbackAtTime(uiNextBeat, 0)
    .repeat(beatDur)
    .tolerance(100)

// This function activates the beat `beatInd` of `track`.
  var startBeat = function(track, beatInd, asset) {
    var scheduleBeat = function(time) {
      var bufferNode = soundBank[track]()
        , redo = function() { scheduleBeat(event.time + barDur) }
        , event = (bufferNode.start ? bufferNode.start2(time) : bufferNode.noteOn2(time))
          .tolerance(0.01)
      if (asset != null) {
        simulateKeypress(asset)
      }
      event.asset = asset
      event.on('executed', redo)
      event.on('expired', redo)
      beats[track][beatInd] = event
    }
    scheduleBeat(nextBeatTime(beatInd))
  }

// This function deactivates the beat `beatInd` of `track`.
  var stopBeat = function(track, beatInd) {
    var event = beats[track][beatInd]
    event.clear()
    event.removeAllListeners()
  }

// ---------- Just some helpers ---------- //
// This helper calculates the absolute time of the upcoming `beatInd`.
  var nextBeatTime = function(beatInd) {
    var currentTime = context.currentTime
      , currentBar = Math.floor(currentTime / barDur)
      , currentBeat = Math.round(currentTime % barDur)
    if (currentBeat < beatInd) return currentBar * barDur + beatInd * beatDur
    else return (currentBar + 1) * barDur + beatInd * beatDur
  }

// This helper loads sound buffers
  var loadTrack = function(track) {
    var request = new XMLHttpRequest()
    request.open('GET', 'sounds/' + track + '.wav', true)
    request.responseType = 'arraybuffer'
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        var createNode = function() {
          var node = context.createBufferSource()
          node.buffer = buffer
          node.connect(context.destination)
          return node
        }
        soundBank[track] = createNode
      })
    }
    request.send()
  }

// This helper loads sound buffers
  var loadTrackFromPath = function(path) {
    var request = new XMLHttpRequest()
    request.open('GET', path, true)
    request.responseType = 'arraybuffer'
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        var createNode = function() {
          var node = context.createBufferSource()
          node.buffer = buffer
          if (mute_metronome) {
            node.gain.value = 0;
          }
          node.connect(context.destination)
          return node
        }
        soundBank[path] = createNode
      })
    }
    request.send()
  }

  loadTrackFromPath('assets/B/flash-1.mp3')
  beats['assets/B/flash-1.mp3'] = {}
  loadTrackFromPath('assets/B/flash-2.mp3')
  beats['assets/B/flash-2.mp3'] = {}

  $('#signature').html(signature)
  $('#tempo').html(tempo)
  $('#pattern tr').each(function() {
    var track = $(this)
      , trackName = track.data('track')
    loadTrack(trackName)
    beats[trackName] = {}
    for (var beatInd = 0; beatInd < signature; beatInd++) {
      var td = $('<td class="'+beatInd+'"><div class="beat"></div></td>')
      td.appendTo(track)
      td.find('.beat').click(function(beatInd) {
        return function() {
          var beat = $(this)
          if (!beat.hasClass('active')) {
            beat.addClass('active')
            startBeat(trackName, beatInd)
          } else {
            beat.removeClass('active')
            stopBeat(trackName, beatInd)
          }
        }
      }(beatInd))
    }
  })

  window.onload = function() {

    var bpmInterval = window.setTimeout(function() {
      startBeat('assets/B/flash-2.mp3', 0);
      startBeat('assets/B/flash-1.mp3', 1);
      startBeat('assets/B/flash-1.mp3', 2);
      startBeat('assets/B/flash-1.mp3', 3);
      mute_metronome = false;
    }, (2000))

  };

});
