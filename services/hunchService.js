var connection = require('../connection.js');
var formatting = require('./formatting.js');

module.exports = {
	newHunch : function(callback){
		connection.query("SELECT id, tag_name FROM tags", function(err, tags_results) {
			if (err) throw err;


			connection.query("SELECT id, name FROM coders", function(err, coders_results) {
				if (err) throw err;

				callback({
					tags : tags_results,
					coders : coders_results
				});
			});
		});
	},
	saveHunch : function(hunchInfo, callback){

		var today = new Date();

		var hunch = {
				description : hunchInfo.hunchDescription,
				rating : hunchInfo["rating"] == undefined ? 2 : hunchInfo["rating"],
				date_created : new Date()
			};

		connection.query('INSERT INTO hunches (description, rating , date_created) VALUES(?,?,?)', [hunch.description, hunch.rating, hunch.date_created], function(err, insertResults) {
			if (err) throw err;

			var tag_hunch_ids = formatting.values_to_insert(hunchInfo["tags[]"], insertResults.insertId);

			connection.query('INSERT INTO tag_hunch (hunch_id, tag_id) VALUES' + tag_hunch_ids, function(err, tagHunchResults) {
				if (err) throw err;

				var coder_hunch_ids = formatting.values_to_insert(hunchInfo["coders[]"], insertResults.insertId);

				connection.query('INSERT INTO coder_hunch (hunch_id, coder_id) VALUES' + coder_hunch_ids, function(err, coderHunchResults) {
					if (err) throw err;

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

    	var sql_query = "SELECT hunches.id, description, tags, coders, rating " +
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
						"ON hunch_coders.hunch_id = hunches.id;";

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

    	//Get coders of this hunch
		var coders_query = "SELECT coders.id, name " +
							"FROM coders " +
							"INNER JOIN coder_hunch " +
							"ON coder_id = coders.id "+
							"WHERE hunch_id = ?";

		//Get tags of this hunch
		var tags_query = "SELECT tags.id, tag_name " +
    					"FROM tags " +
    					"INNER JOIN tag_hunch " +
    					"ON tag_id = tags.id "+
    					"WHERE hunch_id = ?";

		connection.query(hunch_query, hunch_id, function(err, hunch_results) {
			if (err) throw err;

		    connection.query(coders_query, hunch_id, function(err, hunch_coders_results) {
		    	if (err) throw err;

		        connection.query(tags_query, hunch_id, function(err, hunch_tags_results) {
		        	if (err) throw err;

		        	var coder_ids = formatting.sql1_list_string(hunch_coders_results);

		        	//Get coders NOT of this hunch
		        	var other_coders_query = "SELECT coders.id, name, hunch_id " +
		        							"FROM coders " +
		        							"INNER JOIN coder_hunch " +
		        							"ON hunch_id != ? " +
		        							"&& coders.id NOT IN (" +
		        								"SELECT id from coders where id in " + coder_ids + " " +
		        								") " +
											"GROUP BY name";

		            connection.query(other_coders_query, hunch_id, function(err, coders_results) {
		            	if (err) throw err;

		            	var tag_ids = formatting.sql1_list_string(hunch_tags_results);

		            	//Get tags NOT of this hunch
		            	var other_tags_query = "SELECT tags.id, tag_name, hunch_id " +
		            							"FROM tags " +
		            							"INNER JOIN tag_hunch " +
		            							"ON hunch_id != ? && tags.id " +
		            							"NOT in " + tag_ids +" " +
		            							"GROUP BY tag_name";

		                connection.query(other_tags_query, hunch_id, function(err, tags_results) {
		            	if (err) throw err;

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

		var remove_hunch_tags_query = "DELETE FROM tag_hunch WHERE hunch_id = ?"

		var remove_hunch_coders_query = "DELETE FROM coder_hunch WHERE hunch_id = ?"

		connection.query(hunch_query, [hunch.description, hunch.rating, hunch_id], function(err, updateResults) {
			if (err) throw err;

			var tag_hunch_ids = formatting.values_to_insert(hunchInfo["tags[]"], hunch_id);

			connection.query(remove_hunch_tags_query, hunch_id, function(err, tagHunchRemoveResults) {
				if (err) throw err;

				var insert_tag_hunch_query = "INSERT INTO tag_hunch (hunch_id, tag_id) VALUES" + tag_hunch_ids;

				connection.query(insert_tag_hunch_query, function(err, tagHunchResults) {
					if (err) throw err;

					var coder_hunch_ids = formatting.values_to_insert(hunchInfo["coders[]"], hunch_id);

					connection.query(remove_hunch_coders_query, hunch_id, function(err, coderRemoveHunchResults) {
						if (err) throw err;

						var insert_coder_hunch_query = "INSERT INTO coder_hunch (hunch_id, coder_id) VALUES" + coder_hunch_ids;

						connection.query(insert_coder_hunch_query, function(err, coderHunchResults) {
							if (err) throw err;

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

    	//Delete coders of this hunch
		var delete_coder_hunch_query = "DELETE FROM coder_hunch " +
										"WHERE hunch_id = ?";


		//Delete tags of this hunch
		var delete_tag_hunch_query = "DELETE FROM tag_hunch " +
				    					"WHERE hunch_id = ?";


		connection.query(delete_tag_hunch_query, hunch_id, function(err, delete_tag_hunch_results) {
			if (err) throw err;

		    connection.query(delete_coder_hunch_query, hunch_id, function(err, delete_coder_hunch_results) {
		    	if (err) throw err;

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
		
    	var sql_query = "SELECT hunches.id, description, tags, coders, rating " +
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
						"OR rating LIKE \'%" + searchString + "%\' ";

		connection.query(sql_query, function(err, searchResults) {
			if (err) throw err;

		    callback(searchResults);

		});
	}
}