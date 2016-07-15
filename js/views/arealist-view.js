/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.AreaListView = Backbone.View.extend({

		el: '.areas',

		events: {
			'keypress .new-area': 'createOnEnter'
		},

		initialize: function () {
			this.$input = this.$('.new-area');
			this.$areas = this.$('.areas');
			this.$list = $('.area-list');

			this.listenTo(app.areas, 'add', this.addOne);
			this.listenTo(app.areas, 'reset', this.addAll);
			this.listenTo(app.areas, 'filter', this.render);
			this.listenTo(app.areas, 'updateOrder', this.updateOrder);

			$('.new-area').focus(function(){
				$('.area-hint').removeClass('hidden');
			}).blur(function(){
				$('.area-hint').addClass('hidden');
			});

			$( ".area-list" ).sortable({
				revert: true,
				start: function(event, ui) {
					app.dragged = true;
				},
				stop: function(event, ui) {
					app.dragged = false;
				},
				update: function( event, ui ) {
					app.areas.trigger('updateOrder');
				}
			});

			// Suppresses 'add' events with {reset: true} and prevents the app view
			// from being re-rendered for every model. Only renders when the 'reset'
			// event is triggered at the end of the fetch.
			app.areas.fetch({reset: true});
			this.render();
		},

		render: function () {
			if (app.areas.length) {
				this.$areas.show();
			} else {
				this.$areas.hide();
			}
			this.selectArea();
		},

		resetDroppable: function(){
			$(".droppable-area").droppable({
				accept: ".draggable-project",
				activeClass: 'active',
				hoverClass:'hovered',
				drop:function(event,ui){
					app.dropped = true;
					var project = app.projects.get($(ui.draggable).find('.title-label').data('id'));
					project.save({
									area: $(event.target).find('.title-label').data('id')
					});
					app.projects.trigger('filter');
				}
			});
		},
		updateOrder: function(){
			$('.area-list li').each(function(i){
				for(var j in app.areas.models){
					var model = app.areas.models[j];
					if(model.get('id') === $(this).find('label').data('id')){
						model.save({
			      				order: i
			      });
					}
				}
			});
			this.resetDroppable();
		},

		selectArea: function () {
			$('.areas .selected').removeClass('selected');
			app.selectedAreaID = '';
			app.areas.each(function(area){
				area.select(false);
				if(app.AreaFilter && area.get('title').toLowerCase() === app.AreaFilter.toLowerCase()){
					app.selectedAreaID = area.id;
					area.select(true);
				}
			});
			this.resetDroppable();
		},

		addOne: function (area) {
			var view = new app.AreaView({ model: area });
			this.$list.append(view.render().el);
		},

		addAll: function () {
			this.$list.html('');
			app.areas.each(this.addOne, this);
		},

		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: app.areas.nextOrder(),
			};
		},

		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				app.areas.create(this.newAttributes(),{wait: true});
				this.$input.val('');
			}
		},

		clearCompleted: function () {
			_.invoke(app.areas.completed(), 'destroy');
			return false;
		},

	});
})(jQuery);
