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
		},
		projectsByArea: function(area){
			return this.where({area: area});
		},
		getProjectsByTitle: function(title){
			return this.where({title: title});
		}
	});

	app.projects = new Projects();
})();
