
NeuronalSynchrony.Views.SequencerPanelView = Backbone.Marionette.ItemView.extend({
  initialize: function() {
//    this.listenTo(this.model, "closeSongView", this.closeSongView);
//    this.listenTo(this.model, "stopSeq", this.stopSeq);
  },
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
    console.log("closeSongView.")
    $('#sequencer_panel').hide();
  },
  closeSongView: function() {
    console.log("closeSongView.")
//    $('#sequencer_panel').remove();
//    NeuronalSynchrony.Views.SongView.close();
    NeuronalSynchrony.SequencerLayout.toolsRegion.currentView.remove()
    NeuronalSynchrony.SequencerLayout.barsRegion.currentView.remove()

    NeuronalSynchrony.SequencerLayout.toolsRegion.currentView.stopListening()
    NeuronalSynchrony.SequencerLayout.barsRegion.currentView.stopListening()

    NeuronalSynchrony.SequencerLayout.toolsRegion.currentView.close()
    NeuronalSynchrony.SequencerLayout.barsRegion.currentView.close()
    NeuronalSynchrony.SequencerLayout.toolsRegion.stopListening();
    NeuronalSynchrony.SequencerLayout.barsRegion.stopListening();
    NeuronalSynchrony.SequencerLayout.toolsRegion.close();
    NeuronalSynchrony.SequencerLayout.barsRegion.close();

    NeuronalSynchrony.SequencerPanel.stopListening();
    NeuronalSynchrony.seqPanelRegion.close();

    this.stopListening();

//    $('#sequencer_panel').hide();
  },
  onClose: function () {
    this.unbind('closeSongView');
    this.unbind('stopSeq');
  }

});