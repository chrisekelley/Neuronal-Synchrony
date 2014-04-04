/*global NeuronalSynchrony, Backbone*/

NeuronalSynchrony.Models = NeuronalSynchrony.Models || {};

(function () {
    'use strict';

    NeuronalSynchrony.Models.BarModel = Backbone.Model.extend({

        url: '',

        initialize: function() {
          this.bind("remove", function() {
            this.destroy();
          });
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

//      parse: function(response, options)  {
////            return response;
//        var result = _.pluck(response.rows, 'value')
//        return result;
//      },

      sync: BackbonePouch.sync({
        db: PouchDB('SEQdb')
      })
    });


})();
