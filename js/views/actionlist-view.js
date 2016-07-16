/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.ActionListView = Backbone.View.extend({

		el: '.actions',
		statusTemplate: _.template($('#status-filter-template').html()),
		events: {
			'keypress .new-action': 'createOnEnter',
			'click .clear-completed': 'clearCompleted',
			'click .toggle-all': 'toggleAllComplete',
			'click .filter-all': 'setFilterAll',
			'click .filter-active': 'setFilterActive',
			'click .filter-completed': 'setFilterCompleted'
		},

		initialize: function () {
			this.$input = this.$('.new-action');
			this.$statusfilter = this.$('.status-filter');
			this.$list = $('.action-list');
			this.allCheckbox = this.$('.toggle-all')[0];
			this.$el.removeClass('hidden');

			this.listenTo(app.actions, 'add', this.addOne);
			this.listenTo(app.actions, 'reset', this.addAll);
			this.listenTo(app.actions, 'remove', this.render);
			this.listenTo(app.actions, 'filter', this.render);
			this.listenTo(app.actions, 'toggleCompleted', this.render);
			this.listenTo(app.actions, 'updateOrder', this.updateOrder);

			$('.new-action').focus(function(){
				$('.action-hint').removeClass('hidden');
			}).blur(function(){
				$('.action-hint').addClass('hidden');
			});

			$( ".action-list" ).sortable({
				revert: true,
				start: function(event, ui) {
					app.dragged = true;
            app.draggable_sibling = $(ui.item).prev();
        },
        stop: function(event, ui) {
					app.dragged = false;
            if (app.dropped) {
                if (app.draggable_sibling.length == 0)
                    $('.action-list').prepend(ui.item);

                app.draggable_sibling.after(ui.item);
                app.dropped = false;
            }
        },
				update: function( event, ui ) {
					app.actions.trigger('updateOrder');
				}
			}).disableSelection();


			app.actions.fetch({reset: true});

			this.render();
		},

		render: function () {
			var completed = app.actions.completed().length;
			var remaining = app.actions.remaining().length;

			if (app.selectedProjectID) {
				this.$el.show();

				this.$statusfilter.html(this.statusTemplate({
									completed: completed,
									remaining: remaining
				}));

				this.$('.filters li button')
					.removeClass('selected-filter')
					.filter('.filter-' + (app.ActionStatusFilter || 'all'))
					.addClass('selected-filter');

			} else {
				this.$el.hide();
			}
			this.allCheckbox.checked = !remaining;

			this.filterAll();
			this.selectAction();
		},

		updateOrder: function(){
			$('.action-list li').each(function(i){
				for(var j in app.actions.models){
					var model = app.actions.models[j];
					if(model.get('id') === $(this).find('label').data('id')){
						model.save({
										order: i
						});
					}
				}
			});
		},

		selectAction: function () {
			$('.actions .selected').removeClass('selected');
			app.selectedActionID = '';
			app.actions.each(function(action){
				action.select(false);
				if(app.selectedProjectID && app.ActionFilter && action.get('title').toLowerCase() === app.ActionFilter.toLowerCase()
				&& (action.get('project') === app.selectedProjectID || app.selectedProjectID === "project-all")){
					app.selectedActionID = action.id;
					action.select(true);
				}
			});
			app.actions.trigger('actionSeletected');
		},

		filterOne: function (action) {
			action.trigger('visible');
		},

		filterAll: function () {
			app.actions.each(this.filterOne, this);
		},

		setFilterAll: function() {
			app.AreaRouter.navigate(encodeURIComponent(app.AreaFilter)+'/p'+encodeURIComponent(app.ProjectFilter)+(app.ActionFilter ? '/a'+encodeURIComponent(app.ActionFilter) : '' )+'/fall', {trigger: true});
		},
		setFilterActive: function() {
			app.AreaRouter.navigate(encodeURIComponent(app.AreaFilter)+'/p'+encodeURIComponent(app.ProjectFilter)+(app.ActionFilter ? '/a'+encodeURIComponent(app.ActionFilter) : '' )+'/factive', {trigger: true});
		},
		setFilterCompleted: function() {
			app.AreaRouter.navigate(encodeURIComponent(app.AreaFilter)+'/p'+encodeURIComponent(app.ProjectFilter)+(app.ActionFilter ? '/a'+encodeURIComponent(app.ActionFilter) : '' )+'/fcompleted', {trigger: true});
		},

		addOne: function (action) {
			var view = new app.ActionView({ model: action });
			this.$list.append(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		addAll: function () {
			this.$list.html('');
			app.actions.each(this.addOne, this);
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: app.actions.nextOrder(),
				project: app.selectedProjectID,
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				if(app.selectedAreaID === "" || app.selectedAreaID === "area-all"){
					$('#dialog-confirm #dialog-message').html('Please select the area where this activity should be created.');
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
				}else if(app.selectedProjectID === "" || app.selectedProjectID === "project-all"){
					$('#dialog-confirm #dialog-message').html('Please select the project where this activity should be created.');
					$( "#dialog-confirm" ).dialog({
						title:"Project must be selected",
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
					app.actions.create(this.newAttributes(),{wait: true});
					this.$input.val('');
				}
			}
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function () {
			$( function() {
				$('#dialog-confirm #dialog-message').html('Are you sure you want to permanently clear all completed actions?');
				$( "#dialog-confirm" ).dialog({
					title:"Clear Completed",
					resizable: false,
					height: "auto",
					width: 400,
					modal: true,
					buttons: {
						"Clear Completed": function() {
							_.invoke(app.actions.completedByProject(app.selectedProjectID), 'destroy');
							app.actions.trigger('toggleCompleted');
							$( this ).dialog( "close" );
						},
						Cancel: function() {
							$( this ).dialog( "close" );
						}
					}
				});
			});
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;

			app.actions.each(function (action) {
				if(action.get('project') === app.selectedProjectID){
					action.save({
						completed: completed
					});
				}
			});
			app.actions.trigger('toggleCompleted');
		}

	});
})(jQuery);
