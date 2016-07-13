/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.ActionDetailsView = Backbone.View.extend({

		el: '.action-details',
		template: _.template($('#action-details-template').html()),
		events: {
			'click .toggle': 'toggleCompleted',
			'click .destroy': 'clear',
			'keyup .edit': 'handleKeyPress',
			'blur #action-title': 'updateNavigation'
		},
		selectedAction:{},

		initialize: function () {
			this.$detailsDiv = this.$('.action-details-div');
			this.listenTo(app.actions, 'remove', this.render);
			this.listenTo(app.actions, 'filter', this.render);
			this.listenTo(app.actions, 'toggleCompleted', this.render);
			this.listenTo(app.actions, 'actionSeletected', this.render);

			this.render();
		},

		render: function () {
			var selectedActionArr = app.actions.selected();
			if (selectedActionArr.length > 0) {
				this.selectedAction = selectedActionArr[0];
				this.$el.show();

				this.$detailsDiv.html(this.template({
									action: this.selectedAction
				}));
			} else {
				this.$el.hide();
			}
			this.$title = this.$('.action-details-div #action-title');
		},

		toggleCompleted: function () {
			this.selectedAction.toggleCompleted();
		},

		clear: function () {
			if(confirm("You are about to permanently delete this action. Continue?")){
				this.selectedAction.destroy();
			}
		},

		handleKeyPress: function (e) {
			if (e.which === ESC_KEY) {
				$(e.target).val(e.target.defaultValue);
				this.close(e.target);
			}else if(e.which === ENTER_KEY){
				if(e.target.nodeName.toUpperCase() === 'INPUT'){
					$(e.target).blur()
				}
			}
			this.close(e.target);
		},

		close: function (target) {
			var $input = $(target);
			var value = $input.val();
			var trimmedValue = value.trim();

			if (trimmedValue) {
				if(target.id === 'action-title'){
					this.selectedAction.save({ title: trimmedValue });
				}else if(target.id === 'action-note'){
					this.selectedAction.save({ note: trimmedValue });
				}
			}
		},

		updateNavigation: function(){
			app.AreaRouter.navigate(encodeURIComponent(app.AreaFilter)+'/p'+encodeURIComponent(app.ProjectFilter)+'/a'+encodeURIComponent(this.selectedAction.get('title'))+'/f'+app.ActionStatusFilter, {trigger: true});
		}

	});
})(jQuery);
