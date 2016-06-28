/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	app.Project = Backbone.Model.extend({
		defaults: {
			title: '',
			area: ''
		}
	});
})();
