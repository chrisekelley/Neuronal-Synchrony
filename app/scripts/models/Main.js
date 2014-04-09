/*global NeuronalSynchrony, Backbone*/


(function () {
  'use strict';

  NeuronalSynchrony.Models.MainModel = Backbone.Model.extend({

    bpm: 120,

    initialize: function() {
      this.bind("remove", function() {
        this.destroy();
      });
    },

    defaults: {
    },

    validate: function(attrs, options) {
    }

//      parse: function(response, options)  {
////            return response;
//        var result = _.pluck(response.rows, 'value')
//        return result;
//      },


  });


})();
