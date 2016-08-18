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

function showButtonMenu(event){
	$( "#menu").removeClass('hidden').addClass('menu-show').removeClass('menu-hide');
	$( "#menu-button").removeClass('menu-button-show').addClass('menu-button-hide');
	event.stopPropagation();
	event.preventDefault();
	$('body').click(hideButtonMenu);
}

function hideButtonMenu(){
	$( "#menu").addClass('menu-hide').removeClass('menu-show');
	$( "#menu-button").removeClass('menu-button-hide').addClass('menu-button-show');
	$('body').off( "click" );
}

$(document).ready(function(){
	$( "#menu-button").click(showButtonMenu);
	$( "#menu").mouseleave(hideButtonMenu);
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
	$( "#upload-button").click(function(){
		$('#dialog-confirm #dialog-message').html('Importing data will <strong>permanently</strong> delete exising data. Continue?<br><div id="import-status"></div><input type="file" id="import-file">');
		$( "#dialog-confirm" ).dialog({
			title:"Import Data",
			resizable: false,
			height: "auto",
			width: 400,
			modal: true,
			buttons: {
				"Overwrite and Import": function() {

					var selectedFile = document.getElementById('import-file').files[0];
					if(selectedFile){
						var reader = new FileReader();
						var dialog = $( this )
						reader.onload = function(e){
							var obj = JSON.parse(e.target.result);
							localStorage.clear();
							for (var key in obj) {
								localStorage.setItem(key,obj[key]);
							}

							app.selectedCategoryID = "";
							app.categories.fetch();
							app.actions.fetch();
							//force a re-render
							app.actions.trigger('filter');
							dialog.dialog( "close" );
						}
						reader.readAsText(selectedFile);
					}else{
						document.getElementById('import-status').innerHTML = "No file selected, please select a file.";
					}
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	});
	$( "#clear-button").click(function(){
		$('#dialog-confirm #dialog-message').html('Are you sure you want to <strong>permanently</strong> delete category and action data?');
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
