/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.ProjectListView = Backbone.View.extend({

		el: '.projects',

		events: {
			'keypress .new-project': 'createOnEnter'
		},

		initialize: function () {
			this.$input = this.$('.new-project');
			this.$footer = this.$('.footer');
			this.$list = $('.project-list');
			this.$el.removeClass('hidden');

			this.listenTo(app.projects, 'add', this.addOne);
			this.listenTo(app.projects, 'reset', this.addAll);
			this.listenTo(app.projects, 'filter', this.render);
			this.listenTo(app.projects, 'updateOrder', this.updateOrder);
			this.listenTo(app.actions, 'update', _.debounce(this.updateCompleteCountsAll,0));
			this.listenTo(app.actions, 'change:completed', _.debounce(this.updateCompleteCountsAll,0));

			$('.new-project').focus(function(){
				$('.project-hint').removeClass('hidden');
			}).blur(function(){
				$('.project-hint').addClass('hidden');
			});

			app.projects.fetch({reset: true});
			this.render();
		},

		render: function () {

			if (app.selectedAreaID) {
				this.$el.show();
			} else {
				this.$el.hide();
			}
			this.filterAll();
			this.selectProject();
		},

		updateOrder: function(){
			$('.project-list li').each(function(i){
				for(var j in app.projects.models){
					var model = app.projects.models[j];
					if(model.get('id') === $(this).find('label').data('id')){
						model.save({
										order: i
						});
					}
				}
			});
		},

		selectProject: function () {
			$('.projects .selected').removeClass('selected');
			app.selectedProjectID = '';
			app.projects.each(function(project){
				project.select(false);
				if(app.ProjectFilter && project.get('title').toLowerCase() === app.ProjectFilter.toLowerCase()){
					app.selectedProjectID = project.id;
					project.select(true);
				}
			});
		},

		updateCompleteCountsAll: function(){
			app.projects.each(this.updateCompleteCountsOne, this);
		},

		updateCompleteCountsOne: function(project){
			project.save({completedCount:app.actions.completedByProject(project.id).length,
										remainingCount:app.actions.remainingByProject(project.id).length});
		},

		filterOne: function (project) {
			project.trigger('visible');
		},

		filterAll: function () {
			app.projects.each(this.filterOne, this);
		},

		addOne: function (project) {
			console.log(project);
			var view = new app.ProjectView({ model: project });
			this.$list.append(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		addAll: function () {
			this.$list.html('');
			//TODO: get selected area, call .each on
			app.projects.each(this.addOne, this);
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: app.projects.nextOrder(),
				area: app.selectedAreaID,
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				app.projects.create(this.newAttributes(),{wait: true});
				this.$input.val('');
			}
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function () {
			_.invoke(app.projects.completed(), 'destroy');
			return false;
		},

	});
})(jQuery);
