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
