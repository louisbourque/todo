/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.CategoryListView = Backbone.View.extend({

		el: '.categories',

		events: {
			'keypress .new-category': 'createOnEnter'
		},

		initialize: function () {
			this.$input = this.$('.new-category');
			this.$footer = this.$('.footer');
			this.$list = $('.category-list');
			this.$el.removeClass('hidden');
			this.allCategory = new app.Category({
				title:"(All)",
				id:"category-all",
				visible:true
			});

			this.listenTo(app.categories, 'add', this.addOne);
			this.listenTo(app.categories, 'reset', this.addAll);
			this.listenTo(app.categories, 'filter', this.render);
			this.listenTo(app.categories, 'updateOrder', this.updateOrder);
			this.listenTo(app.actions, 'reset', this.updateCompleteCountsAllCategory);//set stats on All Category item
			this.listenTo(app.actions, 'update', _.debounce(this.updateCompleteCountsAll,0));
			this.listenTo(app.actions, 'change:completed', _.debounce(this.updateCompleteCountsAll,0));

			$('.new-category').focus(function(){
				$('.category-hint').removeClass('hidden');
			}).blur(function(){
				$('.category-hint').addClass('hidden');
			});

			$( ".category-list" ).sortable({
				revert: true,
				start: function(event, ui) {
					app.dragged = true;
				},
				stop: function(event, ui) {
					app.dragged = false;
				},
				update: function( event, ui ) {
					app.categories.trigger('updateOrder');
				}
			});

			app.categories.fetch({reset: true});
			this.render();
		},

		render: function () {
			this.filterAll();
			this.selectCategory();
			this.updateCompleteCountsAllCategory();
		},

		resetDroppable: function(){
			$(".droppable-category").droppable({
				accept: ".draggable-action",
				activeClass: 'active',
				hoverClass:'hovered',
				drop:function(event,ui){
					app.dropped = true;
					var action = app.actions.get($(ui.draggable).find('.title-label').data('id'));
					action.save({
									category: $(event.target).find('.title-label').data('id')
					});
					app.actions.trigger('filter');
					app.actions.trigger('update');//trigger update of complete stats
				}
			});
		},
		updateOrder: function(){
			$('.category-list li').each(function(i){
				for(var j in app.categories.models){
					var model = app.categories.models[j];
					if(model.get('id') === $(this).find('label').data('id')){
						model.save({
										order: i
						});
					}
				}
			});
			this.resetDroppable();
		},

		selectCategory: function () {
			$('.categories .selected').removeClass('selected');
			app.categories.each(function(category){
				category.select(false);
			});
			if(app.selectedCategoryID){
				if(app.selectedCategoryID === this.allCategory.id){
					this.allCategory.set("selected",true);
					this.allCategory.trigger("change");
				}else{
					var selectedCategory = app.categories.get(app.selectedCategoryID);
					if(selectedCategory){
						selectedCategory.select(true);
					}else{
						//selected category was deleted
						app.selectedCategoryID = '';
					}
				}
			}
			this.resetDroppable();
		},

		updateCompleteCountsAll: function(){
			app.categories.each(this.updateCompleteCountsOne, this);
			this.updateCompleteCountsAllCategory();
		},

		updateCompleteCountsOne: function(category){
			category.save({completedCount:app.actions.completedByCategory(category.id).length,
										remainingCount:app.actions.remainingByCategory(category.id).length});
		},

		updateCompleteCountsAllCategory: function(){
			this.allCategory.set({completedCount:app.actions.completed().length,
														remainingCount:app.actions.remaining().length});
			this.allCategory.trigger("change");
		},

		filterOne: function (category) {
			category.trigger('visible');
		},

		filterAll: function () {
			app.categories.each(this.filterOne, this);
		},

		addOne: function (category) {
			var view = new app.CategoryView({ model: category });
			this.$list.append(view.render().el);
		},

		addAll: function () {
			this.$list.html('');
			this.addOne(this.allCategory);
			app.categories.each(this.addOne, this);
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: app.categories.nextOrder(),
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
					app.categories.create(this.newAttributes(),{wait: true});
					this.filterAll();
					this.resetDroppable();
					this.$input.val('');
				}
		},

	});
})(jQuery);
