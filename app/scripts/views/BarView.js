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
        this.model.set("index",this.options.itemIndex)
        $(this.el).attr('class','barRow');
        $(this.el).attr('style','background-color:' + rainbowPastel(this.model.get("len"), this.options.itemIndex));
        $(this.el).attr('data-id', this.model.get("_id"));
        $(this.el).attr('data-len', this.model.get("len"));
        $(this.el).attr('data-itemIndex', this.options.itemIndex);
      }
    });

})();
