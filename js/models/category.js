/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	app.Category = Backbone.Model.extend({
		defaults: {
			title: '',
			selected: false,
			completedCount: 0,
			remainingCount: 0,
		},
		select: function(boolean){
      this.save({
      				selected: boolean
      });
    }
	});
})();
