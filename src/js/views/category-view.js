/*global Backbone, jQuery, _, ENTER_KEY, ESC_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.CategoryView = Backbone.View.extend({
		tagName:  'li',

		template: _.template($('#category-template').html()),

		events: {
			'click label': 'select',
			'dblclick label': 'edit',
			'click .destroy': 'clear',
			'keydown .edit': 'handleKeyPress',
			'blur .edit': 'close'
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
			this.$input = this.$('.edit');
			this.$el.addClass('droppable-category draggable-category');
			if(app.selectedCategoryID == this.model.id){
				this.$el.addClass('selected');
			}
			if(this.model.id == "category-all"){
				this.$el.addClass("category-all");
			}
			return this;
		},

		select: function() {
			//workaround - clicking a label doesn't trigger blur and input stays visible
			$('.editing').removeClass('editing');
			if(!app.dragged && app.selectedCategoryID != this.model.id){
				this.updateNavigation(this);
				$('.new-action').focus();
			}
		},


		edit: function () {
			if(this.$el.hasClass('category-all')) return;
			this.$el.addClass('editing');
			this.$input.focus();
		},

		close: function () {
			var value = this.$input.val();
			var trimmedValue = value.trim();

			if (!this.$el.hasClass('editing')) {
				return;
			}

			if(trimmedValue === this.model.get('title')){
				this.$el.removeClass('editing');
				return;
			}

			if (trimmedValue) {
				this.model.save({ title: trimmedValue });
			} else {
				this.clear();
			}

			this.$el.removeClass('editing');
			this.updateNavigation(this);
		},


		handleKeyPress: function (e) {
			if (e.which === ESC_KEY) {
				this.$el.removeClass('editing');
				this.$input.val(this.model.get('title'));
			}else if (e.which === ENTER_KEY) {
				this.close();
			}
		},

		clear: function () {
			var model = this.model;
			$( function() {
				var actionsInCategory = app.actions.actionsByCategory(model.id);
				$('#dialog-confirm #dialog-message').html('Are you sure you want to permanently delete this category and '+actionsInCategory.length+' associated action'+(actionsInCategory.length == 1 ? '' : 's')+'?');
				$( "#dialog-confirm" ).dialog({
					title:"Delete Category",
					resizable: false,
					height: "auto",
					width: 400,
					modal: true,
					buttons: {
						"Delete Category": function() {
							_.invoke(actionsInCategory, 'destroy');
							app.selectedCategoryID = "";
							model.destroy();
							//force actionlist view to re-render
							app.actions.trigger('filter');
							$( this ).dialog( "close" );
						},
						Cancel: function() {
							$( this ).dialog( "close" );
						}
					}
				});
			});
		},

		updateNavigation: function(category){
			app.AreaRouter.navigate(category.model.id+(app.selectedActionID ? '/a'+app.selectedActionID : '' )+'/f'+app.ActionStatusFilter, {trigger: true});
		}


	});
})(jQuery);
