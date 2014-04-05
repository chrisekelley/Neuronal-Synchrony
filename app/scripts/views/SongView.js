/*global NeuronalSynchrony, Backbone, JST*/

NeuronalSynchrony.Views = NeuronalSynchrony.Views || {};

(function () {
    'use strict';

    NeuronalSynchrony.Views.SongView = Backbone.Marionette.CompositeView.extend({

      tagName: "table",
      itemView : NeuronalSynchrony.Views.BarView,
      template: JST['app/scripts/templates/SongView.hbs'],
      itemViewContainer : 'tbody',
//      ,
//      initialize : function() {
//        this.listenTo(this.collection, 'all', this.update);
//      }
//      ,
      events : {
        "click #closeSeqPanel"	  : "closeSongView",
        "click .playBar"	  : "playMe",
        "click .deleteBar"	  : "deleteBar",
        "click #stop_seq_button"	  : "stopSeq"
      },
      playMe: function(e) {
        var id = e.currentTarget.parentElement.attributes['data-id'].value;
        var record = NeuronalSynchrony.Song.where({_id: id});
        console.log("playMe: " + record[0].get("_id"))
        for (var beatInd = 0; beatInd < NeuronalSynchrony.signature; beatInd++) {
          var event = NeuronalSynchrony.beats['graphics'][beatInd]
          if (event!= null) {
            event.clear()
            event.removeAllListeners()
          }
        }
        var beatAssets = record[0].get("beatAssets")
        beatAssets.forEach(function(element, index, list) {
          NeuronalSynchrony.startBeat('graphics', index, element);
        })
      },
      deleteBar: function(e) {
        var id = e.currentTarget.parentElement.attributes['data-id'].value;
        var record = NeuronalSynchrony.Song.where({_id: id});
        console.log("deleteBar: " + record[0].get("_id"))
        NeuronalSynchrony.Song.remove(record,(function(err, response) {
          if (err) {
            console.log("err: " + err)
          } else {
            console.log("Deleting bar.")
          }
        }))
      }
    });

})();
