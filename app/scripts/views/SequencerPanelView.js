
NeuronalSynchrony.Views.SequencerPanelView = Backbone.Marionette.ItemView.extend({
  template: JST['app/scripts/templates/SequencerToolbarPanel.hbs'],
  events : {
    "click #closeSeqPanel"	  : "hideSequencerPanel",
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
  hideSequencerPanel: function(e) {
    $('#sequencer_panel').hide();
  }

});