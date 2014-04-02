/*global NeuronalSynchrony, Backbone*/

NeuronalSynchrony.Collections = NeuronalSynchrony.Collections || {};

(function () {
    'use strict';

    NeuronalSynchrony.Collections.SongCollection = Backbone.Collection.extend({

        model: NeuronalSynchrony.Models.BarModel,
        parse:function(results) {
          return _.pluck(results.rows, 'value');
        }
//        pouch: {
//          options: {
//            query: {
//              include_docs: true,
//              fun: {
//                map: function(doc) {
//                  if (doc.sessionName) {
//                    emit(doc.sessionName, doc);
//                  }
//                }
//              }
//            }
//          }
//        }
    });

})();
