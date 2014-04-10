$(function() {

// Metronome UI


//  NeuronalSynchrony.SequencerLayout.on("show", function(){
//    NeuronalSynchrony.SequencerLayout.barsRegion.show(NeuronalSynchrony.SequencerPanel);
//    NeuronalSynchrony.SequencerLayout.toolsRegion.show(contactsListView);
//  });
  var bpm = 120;
//  var bpmInput = $( "#bpmChosen" );
//  bpm = bpmInput.html();

  var soundBank = {} , beatDur = 60/bpm, barDur = NeuronalSynchrony.signature * beatDur

// Function for moving the beat cursor
  NeuronalSynchrony.beatCount = -1;
  NeuronalSynchrony.beats = {}
  var uiNextBeat = function() {''
    NeuronalSynchrony.beatCount = (NeuronalSynchrony.beatCount + 1) % NeuronalSynchrony.signature
    //console.log("beatCount: " + NeuronalSynchrony.beatCount);
    $('#pattern td').removeClass('active')
    $('#pattern td:nth-child('+(NeuronalSynchrony.beatCount+1)+')').addClass('active')
  }

// The following code highlights the current beat in the UI by calling the function `uiNextBeat` periodically.
  NeuronalSynchrony.beatClock = NeuronalSynchrony.clock.callbackAtTime(uiNextBeat, 0)
    .repeat(beatDur)
    .tolerance(100)

// This function activates the beat `beatInd` of `track`.
  NeuronalSynchrony.startBeat = function (track, beatInd, asset, startNextBar) {
    var scheduleBeat = function(time, isFirst) {
      var currentTime = NeuronalSynchrony.context.currentTime
      var currentBeat = Math.round(currentTime % barDur)
      var currentBeatBare = currentTime % barDur
//      var currentTimeFloored = ~~currentTime
//      var currentBeatBetter = currentTimeFloored % barDur
//      console.log("scheduling beat for " + track + " NeuronalSynchrony.beatCount: " + NeuronalSynchrony.beatCount + " currentBeat: " + currentBeat + " currentBeatBare: " +currentBeatBare + " currentTime: " + currentTime);
      if (soundBank[track] != null) {
        var bufferNode = soundBank[track]()
      }
      var redo = function() { scheduleBeat(event.time + barDur, false) }
        , event = (bufferNode.start ? bufferNode.start2(time) : bufferNode.noteOn2(time))
          .tolerance(0.01)
      if (!isFirst) {
        if (asset != null & asset != false) {
          Duloop.simulateKeypress(asset)
        }
      } else {
        console.log("isFirst is true! not triggering the sample.")
      }
//      event.time = time
      event.asset = asset
      event.on('executed', redo)
      event.on('expired', redo)
      NeuronalSynchrony.beats[track][beatInd] = event
    }
//    if ((typeof startNextBar != "undefined") && (startNextBar)){
//      // schedule for the beginning of the next beat.
//      var nextBarTimeStart = nextBarTime(0);
//      console.log("NeuronalSynchrony.beatCount: " + NeuronalSynchrony.beatCount + " nextBarTime: " + nextBarTimeStart)
//    }
    scheduleBeat(nextBeatTime(beatInd), true)
  }

// This function deactivates the beat `beatInd` of `track`.
  var stopBeat = function(track, beatInd) {
    var event = NeuronalSynchrony.beats[track][beatInd]
    event.clear()
    event.removeAllListeners()
  }

// ---------- Just some helpers ---------- //
// This helper calculates the absolute time of the upcoming `beatInd`.
  var nextBeatTime = function(beatInd) {
    var currentTime = NeuronalSynchrony.context.currentTime
      , currentBar = Math.floor(currentTime / barDur)
      , currentBeat = Math.round(currentTime % barDur)
    if (currentBeat < beatInd) {
      var nextBeatTime = currentBar * barDur + beatInd * beatDur;
      console.log("LESS: currentBeat: " + currentBeat+ " beatInd: " + beatInd + " currentTime: " + currentTime + " currentBar: " + currentBar + " nextBeatTime: " + nextBeatTime)
      return  nextBeatTime
    }
    else {
      var neatBeatTime = (currentBar + 1) * barDur + beatInd * beatDur;
      console.log("MORE: currentBeat: " + currentBeat+ " beatInd: " + beatInd + " currentTime: " + currentTime + " currentBar: " + currentBar + " neatBeatTime: " + neatBeatTime)
      return  neatBeatTime
    }
  }
// This helper calculates the absolute time of the next bar
  var nextBarTime = function(beatInd) {
    var currentTime = NeuronalSynchrony.context.currentTime
      , currentBar = Math.floor(currentTime / barDur)
      , currentBeat = Math.round(currentTime % barDur)
      var nextBarTime = (currentBar + 1) * barDur + beatInd * beatDur;
      console.log("nextBarTime Calc: currentBeat: " + currentBeat+ " beatInd: " + beatInd + " currentTime: " + currentTime + " currentBar: " + currentBar + " nextBarTime: " + nextBarTime)
      return  nextBarTime
  }

// This helper loads sound buffers
  var loadTrack = function(track) {
    console.log("loadTrack: " + track)
    var request = new XMLHttpRequest()
    request.open('GET', 'sounds/' + track + '.wav', true)
    request.responseType = 'arraybuffer'
    request.onload = function() {
      NeuronalSynchrony.context.decodeAudioData(request.response, function(buffer) {
        var createNode = function() {
          var node = NeuronalSynchrony.context.createBufferSource()
          node.buffer = buffer
          node.connect(NeuronalSynchrony.context.destination)
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
      NeuronalSynchrony.context.decodeAudioData(request.response, function(buffer) {
        var createNode = function() {
          var node = NeuronalSynchrony.context.createBufferSource()
          node.buffer = buffer
          if (NeuronalSynchrony.mute_metronome) {
            node.gain.value = 0;
          }
          node.connect(NeuronalSynchrony.context.destination)
          return node
        }
        soundBank[path] = createNode
      })
    }
    request.send()
  }

  // This helper loads a silent metronome.
  var loadTrackForMetronome = function(track) {
    var request = new XMLHttpRequest()
    request.open('GET', 'sounds/' + track + '.wav', true)
    request.responseType = 'arraybuffer'
    request.onload = function() {
      NeuronalSynchrony.context.decodeAudioData(request.response, function(buffer) {
        var createNode = function() {
          var node = NeuronalSynchrony.context.createBufferSource()
          node.buffer = buffer
            node.gain.value = 0;
          node.connect(NeuronalSynchrony.context.destination)
          return node
        }
        soundBank[track] = createNode
      })
    }
    request.send()
  }

  loadTrackFromPath('sounds/strike_edit.wav')
  NeuronalSynchrony.beats['sounds/strike_edit.wav'] = {}
  loadTrackFromPath('sounds/flash-2_edit.wav')
  NeuronalSynchrony.beats['sounds/flash-2_edit.wav'] = {}



  window.onload = function() {

    var bpmLoad = window.setTimeout(function() {
      $('#signature').html(NeuronalSynchrony.signature)
      $('#tempo').html(bpm)
      $('#pattern tr').each(function() {
        var track = $(this)
          , trackName = track.data('track')
        loadTrackForMetronome(trackName)
        NeuronalSynchrony.beats[trackName] = {}
        for (var beatInd = 0; beatInd < NeuronalSynchrony.signature; beatInd++) {
          var td = $('<td class="'+beatInd+'"><div class="beat"></div></td>')
          td.appendTo(track)
          td.find('.beat').click(function(beatInd) {
            return function() {
              var beat = $(this)
              if (!beat.hasClass('active')) {
                beat.addClass('active')
                NeuronalSynchrony.startBeat(trackName, beatInd, false)
              } else {
                beat.removeClass('active')
                stopBeat(trackName, beatInd)
              }
            }
          }(beatInd))
        }
      })

      NeuronalSynchrony.startBeat('sounds/flash-2_edit.wav', 0, false);
      NeuronalSynchrony.startBeat('sounds/strike_edit.wav', 1, false);
      NeuronalSynchrony.startBeat('sounds/strike_edit.wav', 2, false);
      NeuronalSynchrony.startBeat('sounds/strike_edit.wav', 3, false);
      NeuronalSynchrony.mute_metronome = true;
      $('#metro_trigger')[0].style.color = 'red';
      $('#metro_trigger')[0].style.textDecoration = 'line-through';
    }, (2000))

  };

});