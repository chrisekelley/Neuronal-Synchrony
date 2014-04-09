/*global NeuronalSynchrony, Backbone, JST*/

NeuronalSynchrony.Views = NeuronalSynchrony.Views || {};

(function () {
    'use strict';

    NeuronalSynchrony.Views.SongView = Backbone.Marionette.CompositeView.extend({

      tagName: "table",
      itemView : NeuronalSynchrony.Views.BarView,
      template: JST['app/scripts/templates/SongView.hbs'],
      itemViewContainer : 'tbody',
      initialize : function() {
        this.listenTo(NeuronalSynchrony.Song, 'add', this.update);
      },
      events : {
//        "click #closeSeqPanel"	  : "closeSongView",
        "click .playBar"	  : "playMe",
        "click .deleteBar"	  : "deleteBar"
//        "click #stop_seq_button"	  : "stopSeq"
      },
      itemIndex:0,
      itemViewOptions: function(model, index) {
        return {
          itemIndex: index
        }
      },
      getItemView: function(item){
        var itemView = Marionette.getOption(this, "itemView") || this.constructor;

        if (!itemView){
          throwError("An `itemView` must be specified", "NoItemViewError");
        }

        var len = 0
        if (this.collection != null) {
          len = this.collection.length;
        }
        item.set('len',len)
//        item.set('index',index)

        return itemView;
      },
      appendHtml: function(compositeView, itemView, index) {

        if (compositeView.isBuffering) {
          compositeView.elBuffer.appendChild(itemView.el);
          compositeView._bufferedChildren.push(itemView);
        }
        else {
          var $container = this.getItemViewContainer(compositeView);
          $container.append(itemView.el);
        }
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
          NeuronalSynchrony.startBeat('graphics', index, element, true);
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
      },
      close: function(e) {
        console.log("closing SongView.")
      }
    });

})();
