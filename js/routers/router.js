/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var AreaRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {
			app.AreaFilter = param || '';

			app.areas.trigger('filter');
		}
	});

	app.AreaRouter = new AreaRouter();
	Backbone.history.start();
})();
