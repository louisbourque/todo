/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	app.ActionStatusFilter = 'all';
	var AreaRouter = Backbone.Router.extend({
		routes: {
			':category(/a:action)(/f:filter)': 'setFilter'
		},

		setFilter: function (category,action,filter) {
			app.selectedCategoryID = category || '';
			app.selectedActionID = action || '';
			app.ActionStatusFilter = filter || 'all';

			app.categories.trigger('filter');
			app.actions.trigger('filter');
		}
	});

	app.AreaRouter = new AreaRouter();
	Backbone.history.start();
})();
