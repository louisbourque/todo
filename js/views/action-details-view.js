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

			if (app.selectedAreaID && app.selectedProjectID && app.selectedActionID
				&& (app.selectedProjectID === 'project-all' || app.projects.get(app.selectedProjectID).get('visible'))) {
				this.selectedAction = app.actions.get(app.selectedActionID);
					if(this.selectedAction.get('visible') && (app.selectedProjectID === 'project-all' || this.selectedAction.get('project') === app.selectedProjectID)){
					this.$el.show();
					var project = app.projects.get(this.selectedAction.get('project'));
					this.$detailsDiv.html(this.template({
										action: this.selectedAction,
										area: app.areas.get(project.get('area')).get('title'),
										project:project.get('title')
					}));
				} else {
					this.$el.hide();
				}
			}else {
				this.$el.hide();
			}
			this.$title = this.$('.action-details-div #action-title');
		},

		toggleCompleted: function () {
			this.selectedAction.toggleCompleted();
		},

		clear: function () {
			var model = this.selectedAction;
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

		handleKeyPress: function (e) {
			if (e.which === ESC_KEY) {
				$(e.target).val(e.target.defaultValue);
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
			app.AreaRouter.navigate(app.selectedAreaID+'/p'+app.selectedProjectID+'/a'+this.selectedAction.id+'/f'+app.ActionStatusFilter, {trigger: true});
		}

	});
})(jQuery);
