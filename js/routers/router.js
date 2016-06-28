/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var AreaRouter = Backbone.Router.extend({
		routes: {
			':area(/:project)': 'setFilter'
		},

		setFilter: function (area,project) {
			app.AreaFilter = area || '';
			app.ProjectFilter = project || '';
			
			app.areas.trigger('filter');
			app.projects.trigger('filter');
		}
	});

	app.AreaRouter = new AreaRouter();
	Backbone.history.start();
})();
