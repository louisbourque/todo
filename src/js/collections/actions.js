/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var Actions = Backbone.Collection.extend({
		model: app.Action,
		localStorage: new Backbone.LocalStorage('todo-timetrack-actions'),
		comparator: 'order',
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},
		selected: function () {
					return this.where({selected: true});
		},
		completed: function () {
			return this.where({completed: true});
		},
		remaining: function () {
			return this.where({completed: false});
		},
		completedByCategory: function (categoryID) {
			return this.where({completed: true,category: categoryID});
		},
		remainingByCategory: function (categoryID) {
			return this.where({completed: false,category: categoryID});
		},
		actionsByCategory: function (categoryID) {
			return this.where({category: categoryID});
		},
	});

	app.actions = new Actions();
})();
