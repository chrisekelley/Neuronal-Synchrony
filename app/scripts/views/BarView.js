/*global NeuronalSynchrony, Backbone, JST*/

NeuronalSynchrony.Views = NeuronalSynchrony.Views || {};

(function () {
    'use strict';

    NeuronalSynchrony.Views.BarView = Backbone.Marionette.ItemView.extend({
      tagName : 'tr',
      template: JST['app/scripts/templates/BarView.hbs'],
      destroy : function() {
        this.model.destroy();
      },
      onBeforeRender: function(){
        $(this.el).attr('class','barRow');
        $(this.el).attr('data-id', this.model.get("_id"));
      }
    });

})();
