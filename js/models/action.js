/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	app.Action = Backbone.Model.extend({
		defaults: {
			title: '',
			project: '',
			selected: false,
			completed: false
		},
		select: function(boolean){
      this.save({
      				selected: boolean
      });
    }
	});
})();
