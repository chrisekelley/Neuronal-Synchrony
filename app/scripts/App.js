/*global NeuronalSynchrony, Backbone $*/

//NeuronalSynchrony = {};

(function () {
  'use strict';
  window.NeuronalSynchrony = new Backbone.Marionette.Application();

  NeuronalSynchrony.Models = {}
  NeuronalSynchrony.Collections = {}
  NeuronalSynchrony.Views = {}
  NeuronalSynchrony.Routers = {}
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
  Backbone.sync = BackbonePouch.sync({db: PouchDB('SEQdb')});
  Backbone.Model.prototype.idAttribute = '_id';
  NeuronalSynchrony.signature = 4;

  return NeuronalSynchrony;

})();

$(document).ready(function () {
  'use strict';
  NeuronalSynchrony.init();
  NeuronalSynchrony.MainMenuView = new NeuronalSynchrony.Views.MainMenuView();
  NeuronalSynchrony.creditsRegion.show(NeuronalSynchrony.MainMenuView)
});

