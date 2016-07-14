/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	app.Project = Backbone.Model.extend({
		defaults: {
			title: '',
			area: '',
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
