/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var AreaRouter = Backbone.Router.extend({
		routes: {
			':area(/:project)(/:action)': 'setFilter'
		},

		setFilter: function (area,project,action) {
			app.AreaFilter = area || '';
			app.ProjectFilter = project || '';
			app.ActionFilter = action || '';

			app.areas.trigger('filter');
			app.projects.trigger('filter');
			app.actions.trigger('filter');
		}
	});

	app.AreaRouter = new AreaRouter();
	Backbone.history.start();
})();
