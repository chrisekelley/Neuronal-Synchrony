/*global NeuronalSynchrony, Backbone, JST*/

(function () {
  'use strict';

  NeuronalSynchrony.Layouts.SequencerLayout = Backbone.Marionette.Layout.extend({
    template: JST['app/scripts/templates/SequencerLayout.hbs'],
    regions: {
      barsRegion:"#barsRegion",
      toolsRegion:"#toolsRegion"
    }
  });


})();
