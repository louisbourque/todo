/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var Actions = Backbone.Collection.extend({
		model: app.Action,
		localStorage: new Backbone.LocalStorage('todo-timetrack-projects'),
		comparator: 'order',
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},
		filterByProject: function (projectID) {
					return this.where({id: projectID});
		},
		selected: function () {
					return this.where({selected: true});
		}
	});

	app.actions = new Actions();
})();
