/*global NeuronalSynchrony, Backbone, JST*/

NeuronalSynchrony.Layouts = NeuronalSynchrony.Layouts || {};

(function () {
  'use strict';

  NeuronalSynchrony.Layouts.SequencerLayout = Backbone.Marionette.Layout.extend({
    template: JST['app/scripts/templates/SequencerLayout.hbs'],
    regions: {
      barsRegion:"#barsRegion",
      toolsRegion:"#toolsRegion"
    }
  });

  NeuronalSynchrony.Layouts.SequencerPanel = Backbone.Marionette.ItemView.extend({
    template: JST['app/scripts/templates/SequencerToolbarPanel.hbs'],
    events : {
      "click #closeSeqPanel"	  : "closeSongView",
      "click #stop_seq_button"	  : "stopSeq"
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
    $('#sequencer_panel').hide();
  }

});

})();
