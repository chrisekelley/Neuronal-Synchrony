/*global NeuronalSynchrony, Backbone $*/

//NeuronalSynchrony = {};

(function () {
  'use strict';
  window.NeuronalSynchrony = new Backbone.Marionette.Application();

  NeuronalSynchrony.Models = {}
  NeuronalSynchrony.Collections = {}
  NeuronalSynchrony.Views = {}
  NeuronalSynchrony.Routers = {}
  NeuronalSynchrony.Layouts = {};

  NeuronalSynchrony.currentBar = 0;
  NeuronalSynchrony.mute_metronome = true;
  var bpmInput = $( "#bpmChosen" );
  NeuronalSynchrony.bpm = bpmInput.html()

  NeuronalSynchrony.init = function () {
    'use strict';
    console.log('Hello from Backbone!');
  }

  //Organize Application into regions corresponding to DOM elements
  //Regions can contain views, Layouts, or subregions nested as necessary
  NeuronalSynchrony.addRegions({
    headerRegion:"header",
    mainRegion:"#content",
    creditsRegion:"#credits",
    seqPanelRegion:"#sequencer_panel"
  });


  NeuronalSynchrony.addInitializer(function () {
    Backbone.history.start();
  });

  NeuronalSynchrony.sessionName = Date.now();
  console.log("NeuronalSynchrony.sessionName: " + NeuronalSynchrony.sessionName);
//  Local database handle
  NeuronalSynchrony.db = new PouchDB('SEQdb')
  Backbone.sync = BackbonePouch.sync({db: NeuronalSynchrony.db});
  Backbone.Model.prototype.idAttribute = '_id';
  NeuronalSynchrony.signature = 4;

  NeuronalSynchrony.context = typeof AudioContext === 'undefined' ? new webkitAudioContext() : new AudioContext()
  NeuronalSynchrony.clock = new WAAClock(NeuronalSynchrony.context, {toleranceEarly: 0.1})

//  NeuronalSynchrony.soundBank = {}
//  , tempo = QUERY.tempo || 120
//    , tempo = QUERY.tempo ||  bpmInput.val()
//    , signature = NeuronalSynchrony.signature  || 4
//    , beatDur = 60/tempo, barDur = NeuronalSynchrony.signature * beatDur
//    , clock = new WAAClock(context, {toleranceEarly: 0.1})

  return NeuronalSynchrony;

})();

$(document).ready(function () {
  'use strict';
  NeuronalSynchrony.init();
  NeuronalSynchrony.MainMenuView = new NeuronalSynchrony.Views.MainMenuView();
  NeuronalSynchrony.creditsRegion.show(NeuronalSynchrony.MainMenuView)

  NeuronalSynchrony.Song = new NeuronalSynchrony.Collections.SongCollection;
  NeuronalSynchrony.SequencerLayout = new NeuronalSynchrony.Layouts.SequencerLayout();
  NeuronalSynchrony.SequencerPanel = new NeuronalSynchrony.Views.SequencerPanelView();
  Tangerine.initdoc();
});

