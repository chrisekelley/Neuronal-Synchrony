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
      "click #sequencerText-menu": "toggleMetronome",
      "click #new_seq_button": "newSequence",
      "click #play_seq_button": "showSequencerPanel",
      "click #pacman_button": "showHint",
      "change #bpmChosen": "changeBpm"
//      ,
//      "click #stop_seq_button"	  : "stopSeq"
    },
    changeBpm: function(e) {
      console.log("bpm changed.")
    },
    showSequencerPanel: function(e) {
      $('#sequencer_panel').show();
    },
    showHint: function(e) {
      var hint = $('#hint')
      hint.fadeIn();
    },
    toggleMetronome: function(event) {
      console.log("toggleMetronome")
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
        var data = {sessionName: NeuronalSynchrony.sessionName, currentBar: NeuronalSynchrony.currentBar, beatAssets: beatAssets}
//        var doc = new NeuronalSynchrony.Models.BarModel({sessionName: NeuronalSynchrony.sessionName, currentBar: NeuronalSynchrony.currentBar, beatAssets: beatAssets});
//        doc.save({
//          success: function (collection, response, options) {
//            console.log("Adding new bar to song.")
//            NeuronalSynchrony.Song.add(doc)
////            loadSequencePanel
//          },
//          error: function (err) {
//            console.log("Error: " + err);
//          }
//        })

        NeuronalSynchrony.Song.create(data,{
          success: function(model, resp){
            console.log("added new record to song.");
          },
          error: function(err) {
            console.log("Error saving: " + err);
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
//              if (doc.sessionName) {
                emit(doc.sessionName, doc);
//              }
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
    }
  })

})();