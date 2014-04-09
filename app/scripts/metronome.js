$(function() {

// Metronome UI


//  NeuronalSynchrony.SequencerLayout.on("show", function(){
//    NeuronalSynchrony.SequencerLayout.barsRegion.show(NeuronalSynchrony.SequencerPanel);
//    NeuronalSynchrony.SequencerLayout.toolsRegion.show(contactsListView);
//  });
  var bpm = 120;
  var bpmInput = $( "#bpmInput" );
  bpm = bpmInput.val();

  var soundBank = {} , beatDur = 60/bpm, barDur = NeuronalSynchrony.signature * beatDur

// Function for moving the beat cursor
  NeuronalSynchrony.beatCount = -1;
  NeuronalSynchrony.beats = {}
  var uiNextBeat = function() {
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
  NeuronalSynchrony.startBeat = function(track, beatInd, asset) {
    var scheduleBeat = function(time, isFirst) {
//      console.log("scheduling beat for " + track);
      if (soundBank[track] != null) {
        var bufferNode = soundBank[track]()
      }
      var redo = function() { scheduleBeat(event.time + barDur, false) }
        , event = (bufferNode.start ? bufferNode.start2(time) : bufferNode.noteOn2(time))
          .tolerance(0.01)
      if (!isFirst) {
        if (asset != null) {
          Duloop.simulateKeypress(asset)
        }
      } else {
        console.log("isFirst is true! not triggering the sample.")
      }

      var preEvent = function() {
        console.log("I'm an event!")
        var fun = function() {console.log("I'm also an event!")}
        return fun;
      }
//      var event = preEvent()
//      event.time = time
      event.asset = asset
      event.on('executed', redo)
      event.on('expired', redo)
      NeuronalSynchrony.beats[track][beatInd] = event
    }
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
    if (currentBeat < beatInd) return currentBar * barDur + beatInd * beatDur
    else return (currentBar + 1) * barDur + beatInd * beatDur
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

  loadTrackFromPath('assets/B/flash-1.mp3')
  NeuronalSynchrony.beats['assets/B/flash-1.mp3'] = {}
  loadTrackFromPath('assets/B/flash-2.mp3')
  NeuronalSynchrony.beats['assets/B/flash-2.mp3'] = {}



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
                NeuronalSynchrony.startBeat(trackName, beatInd)
              } else {
                beat.removeClass('active')
                stopBeat(trackName, beatInd)
              }
            }
          }(beatInd))
        }
      })

      NeuronalSynchrony.startBeat('assets/B/flash-2.mp3', 0);
      NeuronalSynchrony.startBeat('assets/B/flash-1.mp3', 1);
      NeuronalSynchrony.startBeat('assets/B/flash-1.mp3', 2);
      NeuronalSynchrony.startBeat('assets/B/flash-1.mp3', 3);
      NeuronalSynchrony.mute_metronome = true;
      $('#metro_trigger')[0].style.color = 'red';
      $('#metro_trigger')[0].style.textDecoration = 'line-through';
    }, (2000))

  };

});