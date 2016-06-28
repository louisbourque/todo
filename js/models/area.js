/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	app.Area = Backbone.Model.extend({
		defaults: {
			title: '',
      selected: false
		},
    select: function(boolean){
      this.save({
      				selected: boolean
      });
    }
	});
})();
