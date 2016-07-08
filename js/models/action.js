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
    },
		toggleCompleted: function () {
			this.save({
				completed: !this.get('completed')
			});
			app.actions.trigger('toggleCompleted');
}
	});
})();
