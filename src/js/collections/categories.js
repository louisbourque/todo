/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var Categories = Backbone.Collection.extend({
		model: app.Category,
		localStorage: new Backbone.LocalStorage('todo-timetrack-categories'),
		comparator: 'order',
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},
		selected: function () {
					return this.where({selected: true});
		}
	});

	app.categories = new Categories();
})();
