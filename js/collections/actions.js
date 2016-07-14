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
			return this.where({completed: true,project: app.selectedProjectID});
		},
		remaining: function () {
			return this.where({completed: false,project: app.selectedProjectID});
		},
		completedByProject: function (projectID) {
			return this.where({completed: true,project: projectID});
		},
		remainingByProject: function (projectID) {
			return this.where({completed: false,project: projectID});
		}
	});

	app.actions = new Actions();
})();
