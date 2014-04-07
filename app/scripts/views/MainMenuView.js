/*global NeuronalSynchrony, Backbone, JST*/

(function () {
  'use strict';

  NeuronalSynchrony.Views.MainMenuView = Backbone.Marionette.ItemView.extend({
    template: JST['app/scripts/templates/MainMenuView.hbs']
    ,
//    initialize: function(e) {
//      this.loadSequencePanel()
//    },
    events: {
      "click #sequencerText-menu": "muteMetronome",
      "click #new_seq_button": "newSequence",
      "click #play_seq_button": "showSequencerPanel"
//      ,
//      "click #closeSeqPanel"	  : "closeSongView",
//      "click #stop_seq_button"	  : "stopSeq"
//    ,
//    "click #stop_seq_button": "stopSeq"
    },
    showSequencerPanel: function(e) {
      console.log("closeSongView.")
      $('#sequencer_panel').show();
    },
    muteMetronome: function(event) {
      console.log("muteMetronome")
      if (NeuronalSynchrony.mute_metronome) {
        NeuronalSynchrony.mute_metronome = false;
        $('#metro_trigger')[0].style.color = '#000000';
        $('#metro_trigger')[0].style.textDecoration = 'none';
      } else {
        NeuronalSynchrony.mute_metronome = true;
        $('#metro_trigger')[0].style.color = 'red';
        $('#metro_trigger')[0].style.textDecoration = 'line-through';
      }
    },
    newSequence: function(event) {
      var beatAssets = []
      for (var beatInd = 0; beatInd < NeuronalSynchrony.signature; beatInd++) {
        var event = NeuronalSynchrony.beats['graphics'][beatInd]
        if (event != null) {
          var asset = event.asset;
          NeuronalSynchrony.currentBar = NeuronalSynchrony.currentBar + 1;
          beatAssets[beatInd] = asset
          event.clear()
        }
      }
      if (beatAssets.length > 0) {
        var doc = new NeuronalSynchrony.Models.BarModel({sessionName: NeuronalSynchrony.sessionName, currentBar: NeuronalSynchrony.currentBar, beatAssets:beatAssets});
        doc.save(function(err, response) {
          if (err) {
            console.log("err: " + err)
          } else {
            console.log("Clearing current bar and reloading SequencePanel.")
//            loadSequencePanel
          }
        });
      }

//    db.allDocs({include_docs: true}, function(err, response) {
//      if (err) {
//        console.log("err: " + err)
//      } else {
//        console.log("Here are some docs.")
//      }
//    });
    },
    loadSequencePanel: function(event) {
//      NeuronalSynchrony.seqPanelRegion.close();
      var opts = {
        query: {
          include_docs: false,
          fun: {
            map: function(doc) {
              if (doc.sessionName) {
                emit(doc.sessionName, doc);
              }
            }
          }
        }
      };
      NeuronalSynchrony.Song.fetch({
        fetch: 'query',
        options: opts,
        success: function(collection, response, options) {
          console.log("item count: " + collection.length);
          var viewOptions = {
            collection : NeuronalSynchrony.Song,
            itemView : NeuronalSynchrony.Views.BarView
          };
          var view = new NeuronalSynchrony.Views.SongView(viewOptions)
//        NeuronalSynchrony.seqPanelRegion.show(view);
//        $('#sequencer_panel').show();
//        $('#stop_seq_button').show();
          NeuronalSynchrony.seqPanelRegion.on("show", function(){
            NeuronalSynchrony.SequencerLayout.toolsRegion.show(NeuronalSynchrony.SequencerPanel);
            NeuronalSynchrony.SequencerLayout.barsRegion.show(view);
          });
          NeuronalSynchrony.seqPanelRegion.on("remove", function(){
            console.log("removing seqPanelRegion subviews.")
            NeuronalSynchrony.SequencerLayout.toolsRegion.remove(NeuronalSynchrony.SequencerPanel);
            NeuronalSynchrony.SequencerLayout.barsRegion.remove(view);
          });

          NeuronalSynchrony.seqPanelRegion.show(NeuronalSynchrony.SequencerLayout);
          $('#sequencer_panel').show();
        }
      });
    },
    stopSeq: function(e) {
      console.log("Stop seq..")
      for (var beatInd = 0; beatInd < NeuronalSynchrony.signature; beatInd++) {
        var event = NeuronalSynchrony.beats['graphics'][beatInd]
        if (event != null) {
          event.clear()
        }
      }
    },
    closeSongView: function() {
      console.log("closeSongView.")
//    NeuronalSynchrony.Views.SongView.close();
//    NeuronalSynchrony.SequencerLayout.toolsRegion.currentView.remove()
//    NeuronalSynchrony.SequencerLayout.barsRegion.currentView.remove()
//
//    NeuronalSynchrony.SequencerLayout.toolsRegion.currentView.stopListening()
//    NeuronalSynchrony.SequencerLayout.barsRegion.currentView.stopListening()
//
//    NeuronalSynchrony.SequencerLayout.toolsRegion.currentView.close()
//    NeuronalSynchrony.SequencerLayout.barsRegion.currentView.close()
//    NeuronalSynchrony.SequencerLayout.toolsRegion.stopListening();
//    NeuronalSynchrony.SequencerLayout.barsRegion.stopListening();
//    NeuronalSynchrony.SequencerLayout.toolsRegion.close();
//    NeuronalSynchrony.SequencerLayout.barsRegion.close();
//
//    NeuronalSynchrony.SequencerPanel.stopListening();

      this.stopListening();
      NeuronalSynchrony.seqPanelRegion.close();


//    $('#sequencer_panel').hide();
    }
  })

})();