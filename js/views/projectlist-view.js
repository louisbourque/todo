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
			this.selectedID = '';

			this.listenTo(app.projects, 'add', this.addOne);
			this.listenTo(app.projects, 'reset', this.addAll);
			this.listenTo(app.projects, 'new-area-selected', _.debounce(this.render, 0));

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
		},

		filterOne: function (project) {
			project.trigger('visible');
		},

		filterAll: function () {
			app.projects.each(this.filterOne, this);
		},

		addOne: function (project) {
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
				app.projects.create(this.newAttributes());
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
