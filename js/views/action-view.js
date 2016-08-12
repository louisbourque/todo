/*global Backbone, jQuery, _, ENTER_KEY, ESC_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.ActionView = Backbone.View.extend({
		tagName:  'li',

		template: _.template($('#action-template').html()),

		events: {
			'click label': 'select',
			'click .destroy': 'clear',
			'click .toggle': 'toggleCompleted',
		},

		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},

		render: function () {
			// Backbone LocalStorage is adding `id` attribute instantly after
			// creating a model.  This causes our TodoView to render twice. Once
			// after creating a model and once on `id` change.  We want to
			// filter out the second redundant render, which is caused by this
			// `id` change.  It's known Backbone LocalStorage bug, therefore
			// we've to create a workaround.
			// https://github.com/tastejs/todomvc/issues/469
			if (this.model.changed.id !== undefined) {
				return;
			}

			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('completed', this.model.get('completed'));
			this.$el.toggleClass('hidden', !this.model.get('visible'));
			this.$input = this.$('.edit');
			this.$el.addClass('draggable-action');
			if(app.selectedActionID == this.model.id){
				this.$el.addClass('selected');
				app.actions.trigger('new-action-selected');
			}
			return this;
		},

		select: function() {
			if(app.dragged){return;}
			if(app.selectedActionID != this.model.id){
				this.updateNavigation(this);
			}else{
				this.updateNavigationNoAction(this);
			}
		},

		toggleVisible: function () {
			this.model.set('visible',!this.isHidden());
		},

		toggleCompleted: function () {
			this.model.toggleCompleted();
		},

		isHidden: function () {
			return !!app.selectedCategoryID
			&& this.model.get('category') != app.selectedCategoryID
			&& app.selectedCategoryID != "category-all" 
			|| (app.ActionStatusFilter != 'all' && (this.model.get('completed') && app.ActionStatusFilter === 'active')
					|| (!this.model.get('completed') && app.ActionStatusFilter === 'completed'));
		},

		edit: function () {
			this.$el.addClass('editing');
			this.$input.focus();
		},


		clear: function () {
			var model = this.model;
			$( function() {
				$('#dialog-confirm #dialog-message').html('Are you sure you want to permanently delete this action?');
				$( "#dialog-confirm" ).dialog({
					title:"Delete Action",
					resizable: false,
					height: "auto",
					width: 400,
					modal: true,
					buttons: {
						"Delete Action": function() {
							model.destroy();
							$( this ).dialog( "close" );
						},
						Cancel: function() {
							$( this ).dialog( "close" );
						}
					}
				});
			});
		},

		updateNavigation: function(action){
			app.AreaRouter.navigate(app.selectedCategoryID+'/a'+action.model.id+'/f'+app.ActionStatusFilter, {trigger: true});
		},

		updateNavigationNoAction: function(action){
			app.AreaRouter.navigate(app.selectedCategoryID+'/f'+app.ActionStatusFilter, {trigger: true});
		}


	});
})(jQuery);
