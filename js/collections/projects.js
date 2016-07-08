/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var Projects = Backbone.Collection.extend({
		model: app.Project,
		localStorage: new Backbone.LocalStorage('todo-timetrack-projects'),
		comparator: 'order',
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},
		selected: function () {
					return this.where({selected: true});
		}
	});

	app.projects = new Projects();
})();
