/*global Backbone, jQuery, _, ENTER_KEY, ESC_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.AreaView = Backbone.View.extend({
		tagName:  'li',

		template: _.template($('#item-template').html()),

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
			this.$el.addClass('droppable-area');
			if(app.selectedAreaID == this.model.id){
				this.$el.addClass('selected');
			}
			if(this.model.id == "area-all"){
				this.$el.addClass("area-all");
			}

			return this;
		},

		select: function() {
			//workaround - clicking a label doesn't trigger blur and input stays visible
			$('.editing').removeClass('editing');
			if(!app.dragged && app.selectedAreaID != this.model.id){
				this.updateNavigation(this);
				$('.new-project').focus();
			}
		},

		edit: function () {
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
				if(app.areas.getAreasByTitle(trimmedValue).length || trimmedValue === this.allArea.get('title')){
					$('#dialog-confirm #dialog-message').html('An area with the selected title already exists. Please use a distinct name.');
					$( "#dialog-confirm" ).dialog({
						title:"Area Title already exists",
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
					return;
				}else{
					this.model.save({ title: trimmedValue });
				}

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
				$('#dialog-confirm #dialog-message').html('Are you sure you want to permanently delete this area and all associated projects/actions?');
				$( "#dialog-confirm" ).dialog({
					title:"Delete Area",
					resizable: false,
					height: "auto",
					width: 400,
					modal: true,
					buttons: {
						"Delete Area": function() {
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

		updateNavigation: function(area){
				app.AreaRouter.navigate(encodeURIComponent(area.model.get('title'))+(app.ProjectFilter ? '/p'+encodeURIComponent(app.ProjectFilter) : '' )+(app.ActionFilter ? '/a'+encodeURIComponent(app.ActionFilter) : '' )+'/f'+app.ActionStatusFilter, {trigger: true});
		}
	});
})(jQuery);
