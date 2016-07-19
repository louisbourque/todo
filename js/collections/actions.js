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
		completedBySelectedArea: function () {
			if(app.selectedAreaID == "area-all"){
				return this.where({completed: true});
			}
			var arr = [];
			var projectsInSelectedArea = app.projects.projectsByArea(app.selectedAreaID);
			var actions = this;
			_.each(projectsInSelectedArea,function(project){
				arr = arr.concat( actions.where({completed: true,project: project.id}))
			});
			return arr;
		},
		remainingBySelectedArea: function () {
			if(app.selectedAreaID == "area-all"){
				return this.where({completed: false});
			}
			var arr = [];
			var projectsInSelectedArea = app.projects.projectsByArea(app.selectedAreaID);
			var actions = this;
			_.each(projectsInSelectedArea,function(project){
				arr = arr.concat( actions.where({completed: false,project: project.id}))
			});
			return arr;
		},
		completedByProject: function (projectID) {
			return this.where({completed: true,project: projectID});
		},
		remainingByProject: function (projectID) {
			return this.where({completed: false,project: projectID});
		},
		actionsByProject: function (projectID) {
			return this.where({project: projectID});
		},
	});

	app.actions = new Actions();
})();
