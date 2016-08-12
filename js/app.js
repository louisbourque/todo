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
});
