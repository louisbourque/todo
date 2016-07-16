/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	app.Action = Backbone.Model.extend({
		defaults: {
			title: '',
			note:'',
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
		},
		getArea: function(){
			return app.projects.get(this.get('project')).get("area");
		}
	});
})();
