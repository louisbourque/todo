/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;
app.dragged = false;
app.dropped = false;
app.draggable_sibling;

$(function () {
	'use strict';

	new app.CategoryListView();
	new app.ActionListView();
	new app.ActionDetailsView();
});



$(document).ready(function(){
	$( "#menu-button").click(function(){
		$( "#menu").removeClass('hidden').addClass('menu-show').removeClass('menu-hide');
		//$( "#menu").removeClass('hidden');
		$( "#menu-button").removeClass('menu-button-show').addClass('menu-button-hide');
	});
	$( "#menu").mouseleave(function(){
			$( "#menu").addClass('menu-hide').removeClass('menu-show');

			$( "#menu-button").removeClass('menu-button-hide').addClass('menu-button-show');
    });
	$( "#help-button").click(function(){
		$( "#dialog-help" ).dialog({
			title:"Todo - Help",
			resizable: true,
			height: "auto",
			width: "auto",
			modal: false,
			buttons: {
				OK: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	});
	$( "#download-button").click(function(){
		var ls = JSON.stringify(localStorage);
		var file = new File([ls], "todo.json", {type: "text/plain;charset=utf-8"});
		saveAs(file);
	});
	$( "#clear-button").click(function(){
		$('#dialog-confirm #dialog-message').html('Are you sure you want to permanently delete category and action data?');
		$( "#dialog-confirm" ).dialog({
			title:"Delete All Data",
			resizable: false,
			height: "auto",
			width: 400,
			modal: true,
			buttons: {
				"Delete Everything": function() {
					localStorage.clear();
					app.selectedCategoryID = "";
					app.categories.reset();
					app.actions.reset();
					//force a re-render
					app.actions.trigger('filter');
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	});




});
