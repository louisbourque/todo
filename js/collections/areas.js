/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var Areas = Backbone.Collection.extend({
		model: app.Area,
		localStorage: new Backbone.LocalStorage('todo-timetrack-areas'),
		comparator: 'order',
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},

		selected: function () {
					return this.where({selected: true});
		},
		getAreasByTitle: function(title){
			return this.where({title: title});
		}
	});

	app.areas = new Areas();
})();
