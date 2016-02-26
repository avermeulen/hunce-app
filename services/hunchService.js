var connection = require('../connection.js');

var formattingService = require('./formattingService.js');

var tagService = require('./tagService.js');
var coderService = require('./coderService.js');
var tagHunchService = require('./tagHunchService.js');
var coderHunchService = require('./coderHunchService.js')

module.exports = {

	// Get all coders and tags from database
	newHunch : function(callback){
		tagService.getAllTags(function(tags_results) {

			coderService.getAllCoders(function(coders_results) {

				callback({
					tags : tags_results,
					coders : coders_results
				});
			});
		});
	},

	// Save a new hunch to the database
	saveHunch : function(hunchInfo, callback){

		var today = new Date();

		var hunch = {
				description : hunchInfo.hunchDescription,
				rating : hunchInfo["rating"] == undefined ? 2 : hunchInfo["rating"],
				date_created : new Date()
			};

		connection.query('INSERT INTO hunches (description, rating , date_created) VALUES(?,?,?)', [hunch.description, hunch.rating, hunch.date_created], function(err, insertResults) {
			if (err) throw err;

			var tag_hunch_ids = formattingService.values_to_insert(hunchInfo["tags[]"], insertResults.insertId);

			tagHunchService.saveTagHunch(tag_hunch_ids, function(tagHunchResults) {

				var coder_hunch_ids = formattingService.values_to_insert(hunchInfo["coders[]"], insertResults.insertId);

				coderHunchService.saveCoderHunch(coder_hunch_ids, function( coderHunchResults) {

					callback({
						insertResults : insertResults,
						tagHunchResults : tagHunchResults,
						coderHunchResults : coderHunchResults
					});
				});

			});
		});
	},

	getHunches : function(callback){

    	var sql_query = "SELECT hunches.id, description, tags, coders, rating, DATE_FORMAT(date_created, '%d/%m/%Y') AS date_created " +
    					"FROM hunches " +
    					"LEFT JOIN ( " + 
    					"	SELECT DISTINCT hunch_id, GROUP_CONCAT(tag_name) AS tags " +
    					"	FROM tags " +
    					"	INNER JOIN tag_hunch " +
    					"	ON tag_id = tags.id " +
    					"	GROUP BY hunch_id " +
    					") AS hunch_tags " + 
						"ON hunch_tags.hunch_id = hunches.id " +
						"LEFT JOIN ( " +
						"	SELECT DISTINCT hunch_id, GROUP_CONCAT(name) AS coders " +
						"	FROM coders " +
						"	INNER JOIN coder_hunch " +
						"	ON coder_id = coders.id " +
						"	GROUP BY coder_hunch.hunch_id " +
						") AS hunch_coders " +
						"ON hunch_coders.hunch_id = hunches.id " +
						"ORDER BY hunches.id DESC;";

		connection.query(sql_query, function(err, hunchResults) {
			if (err) throw err;

		    callback(hunchResults);

		});
	},

	editHunch : function(hunch_id, callback){
		
		//Get hunch information in the hunches table
    	var hunch_query = "SELECT id, description, rating " +
    					"FROM hunches " +
    					"WHERE id = ?";

		connection.query(hunch_query, hunch_id, function(err, hunch_results) {
			if (err) throw err;

		    coderService.getCodersOfHunch(hunch_id, function(hunch_coders_results) {

		        tagService.getTagsOfHunch(hunch_id, function(hunch_tags_results) {

		        	// Returns a string that looks like this: (1,2,4,5)
		        	var coder_ids = formattingService.sql1_list_string(hunch_coders_results);

		            coderService.getCoders_NOT_inList(coder_ids, function(coders_results) {

		            	// Returns a string that looks like this: (1,2,4,5)
		            	var tag_ids = formattingService.sql1_list_string(hunch_tags_results);

		                tagService.getTags_NOT_inList(tag_ids, function(tags_results) {

			                callback({
			                	hunch_results : hunch_results,
			                	hunch_coders_results : hunch_coders_results,
			                	hunch_tags_results : hunch_tags_results,
			                	coders_results : coders_results,
			                	tags_results : tags_results
			                });
			            });
		            });
		        });
		    });
		});
	},

	updateHunch : function(hunch_id, hunchInfo, callback){

		var hunch = {
			description : hunchInfo.hunchDescription,
			rating : hunchInfo["rating"] == undefined ? 0 : hunchInfo["rating"]
		};

		var hunch_query = "UPDATE hunches SET description = ?, rating = ? " +
						"	WHERE id = ?";

		var remove_hunch_coders_query = "DELETE FROM coder_hunch WHERE hunch_id = ?"

		connection.query(hunch_query, [hunch.description, hunch.rating, hunch_id], function(err, updateResults) {
			if (err) throw err;

			var tag_hunch_ids = formattingService.values_to_insert(hunchInfo["tags[]"], hunch_id);

			tagHunchService.deleteTagHunch(hunch_id, function(tagHunchRemoveResults) {

				tagHunchService.saveTagHunch(tag_hunch_ids, function(tagHunchResults) {

					var coder_hunch_ids = formattingService.values_to_insert(hunchInfo["coders[]"], hunch_id);

					coderHunchService.deleteCoderHunch(hunch_id, function(coderRemoveHunchResults) {

						coderHunchService.saveCoderHunch(coder_hunch_ids, function(coderHunchResults) {

							callback({
									updateResults : updateResults,
									tagHunchResults : tagHunchResults,
									tagHunchRemoveResults : tagHunchRemoveResults,
									coderHunchResults : coderHunchResults,
									coderRemoveHunchResults : coderRemoveHunchResults
							});

						});
					});
				});

			});
		});
	},

	deleteHunch : function(hunch_id, callback){
		//Delete hunch information in the hunches table
    	var delete_hunch_query = "DELETE FROM hunches " +
		    					"WHERE id = ?";


		tagHunchService.deleteTagHunch(hunch_id, function(delete_tag_hunch_results) {

		    coderHunchService.deleteCoderHunch(hunch_id, function(delete_coder_hunch_results) {

		        connection.query(delete_hunch_query, hunch_id, function(err, delete_hunch_results) {
		        	if (err) throw err;

	                callback({
	                	delete_tag_hunch_results : delete_tag_hunch_results,
	                	delete_coder_hunch_results : delete_coder_hunch_results,
	                	delete_hunch_results : delete_hunch_results
	                });
		        });
		    });
		});
	},

	searchHunches : function(searchString, callback){
		
    	var sql_query = "SELECT hunches.id, description, tags, coders, rating, DATE_FORMAT(date_created, '%d/%m/%Y') AS date_created " +
    					"FROM hunches " +
    					"LEFT JOIN ( " + 
    					"	SELECT DISTINCT hunch_id, GROUP_CONCAT(tag_name) AS tags " +
    					"	FROM tags " +
    					"	INNER JOIN tag_hunch " +
    					"	ON tag_id = tags.id " +
    					"	GROUP BY hunch_id " +
    					") AS hunch_tags " + 
						"ON hunch_tags.hunch_id = hunches.id " +
						"LEFT JOIN ( " +
						"	SELECT DISTINCT hunch_id, GROUP_CONCAT(name) AS coders " +
						"	FROM coders " +
						"	INNER JOIN coder_hunch " +
						"	ON coder_id = coders.id " +
						"	GROUP BY coder_hunch.hunch_id " +
						") AS hunch_coders " +
						"ON hunch_coders.hunch_id = hunches.id " +
						"WHERE description LIKE \'%" + searchString +"%\' "+
						"OR tags LIKE \'%" + searchString + "%\' " +
						"OR coders LIKE \'%" + searchString + "%\' " +
						"ORDER BY hunches.id DESC;";

		connection.query(sql_query, function(err, searchResults) {
			if (err) throw err;

		    callback(searchResults);

		});
	}
}