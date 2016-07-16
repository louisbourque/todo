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
			this.allProject = new app.Project({
				title:"(Show All)",
				id:"project-all"
			});

			this.listenTo(app.projects, 'add', this.addOne);
			this.listenTo(app.projects, 'reset', this.addAll);
			this.listenTo(app.projects, 'filter', this.render);
			this.listenTo(app.projects, 'updateOrder', this.updateOrder);
			this.listenTo(app.actions, 'reset', this.updateCompleteCountsAllProject);//set stats on All Projects item
			this.listenTo(app.actions, 'update', _.debounce(this.updateCompleteCountsAll,0));
			this.listenTo(app.actions, 'change:completed', _.debounce(this.updateCompleteCountsAll,0));

			$('.new-project').focus(function(){
				$('.project-hint').removeClass('hidden');
			}).blur(function(){
				$('.project-hint').addClass('hidden');
			});

			$( ".project-list" ).sortable({
				revert: true,
				start: function(event, ui) {
					app.dragged = true;
				},
				stop: function(event, ui) {
					app.dragged = false;
				},
				update: function( event, ui ) {
					app.projects.trigger('updateOrder');
				}
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
			this.updateCompleteCountsAllProject();
		},

		resetDroppable: function(){
			$(".droppable-project").droppable({
				accept: ".draggable-action",
				activeClass: 'active',
				hoverClass:'hovered',
				drop:function(event,ui){
					app.dropped = true;
					var action = app.actions.get($(ui.draggable).find('.title-label').data('id'));
					action.save({
									project: $(event.target).find('.title-label').data('id')
					});
					app.actions.trigger('filter');
					app.actions.trigger('update');//trigger update of complete stats
				}
			});
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
			this.resetDroppable();
		},

		selectProject: function () {
			$('.projects .selected').removeClass('selected');
			app.selectedProjectID = '';
			app.projects.each(function(project){
				project.select(false);
				if(app.ProjectFilter && project.get('title').toLowerCase() === app.ProjectFilter.toLowerCase()
					&& (project.get('area') === app.selectedAreaID || app.selectedAreaID === "area-all")){
					app.selectedProjectID = project.id;
					project.select(true);
				}
			});
			if(app.ProjectFilter && app.ProjectFilter === this.allProject.get('title')){
				app.selectedProjectID = this.allProject.id;
				this.allProject.set("selected",true);
				this.allProject.trigger("change");
			}
			this.resetDroppable();
		},

		updateCompleteCountsAll: function(){
			app.projects.each(this.updateCompleteCountsOne, this);
			this.updateCompleteCountsAllProject();
		},

		updateCompleteCountsOne: function(project){
			project.save({completedCount:app.actions.completedByProject(project.id).length,
										remainingCount:app.actions.remainingByProject(project.id).length});
		},

		updateCompleteCountsAllProject: function(){
			this.allProject.set({completedCount:app.actions.completedBySelectedArea().length,
														remainingCount:app.actions.remainingBySelectedArea().length});
			this.allProject.trigger("change");
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

		addAll: function () {
			this.$list.html('');
			this.addOne(this.allProject);
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
				if(app.selectedAreaID === "" || app.selectedAreaID === "area-all"){
					$('#dialog-confirm #dialog-message').html('Please select the area where this project should be created.');
					$( "#dialog-confirm" ).dialog({
						title:"Area must be selected",
						resizable: false,
						height: "auto",
						width: 400,
						modal: true,
						buttons: {
							"OK": function() {
								$( this ).dialog( "close" );
							}
						}
					});
				}else if(app.projects.getProjectsByTitle(this.$input.val()).length || this.$input.val() === this.allProject.get('title')){
					$('#dialog-confirm #dialog-message').html('A project with the selected title already exists. Please use a distinct name.');
					$( "#dialog-confirm" ).dialog({
						title:"Project Title already exists",
						resizable: false,
						height: "auto",
						width: 400,
						modal: true,
						buttons: {
							"OK": function() {
								$( this ).dialog( "close" );
							}
						}
					});
				}else{
					app.projects.create(this.newAttributes(),{wait: true});
					this.$input.val('');
				}
			}
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function () {
			_.invoke(app.projects.completed(), 'destroy');
			return false;
		},

	});
})(jQuery);
