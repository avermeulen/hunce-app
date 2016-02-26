var connection = require('../connection.js');

module.exports = {
	saveTag : function(tag, callback){

		var select_tag_query = "SELECT tag_name FROM tags WHERE tag_name = ?";

		connection.query(select_tag_query, tag.tag_name, function(err, tag_results){
			if (err) throw err;

			console.log(tag_results);

			if(tag_results.length == []) {

				var insert_tag_query = "INSERT INTO tags (tag_name) VALUES(?)";

				connection.query(insert_tag_query, tag.tag_name, function(err, tag_results){
					if (err) throw err;

					callback(tag_results);

				});
			}
			else if (tag_results.tag_name || tag_results[0].tag_name) {

				callback(tag_results);

			} 

		});

	},
	getAllTags : function(callback){
		var select_tags_query = "SELECT id, tag_name FROM tags";

		connection.query(select_tags_query, function(err, tag_results){
			if (err) throw err;

			callback(tag_results);
		});
	},
	getTag : function(tag, callback){
		var select_tag_query = "SELECT tag_name FROM tags WHERE id = ?";

		connection.query(select_tag_query, tag.id, function(err, tag_results){
			if (err) throw err;

			callback(tag_results);
		});
	},
	getTagsOfHunch : function(hunch_id, callback){

		var select_tag_query = "SELECT tags.id, tag_name " +
								"FROM tags " +
								"INNER JOIN tag_hunch " +
								"ON tag_id = tags.id " +
								"WHERE hunch_id = ?";

		connection.query(select_tag_query, hunch_id, function(err, tag_results){
			if (err) throw err;

			callback(tag_results);
		});

	},

	getTags_NOT_inList : function(tag_ids, callback){

		var select_tag_query = "SELECT id, tag_name " +
								"FROM tags " +
								"WHERE id NOT IN " + tag_ids;

		connection.query(select_tag_query, function(err, tag_results){
			if (err) throw err;

			callback(tag_results);
		});

	},
	deleteTag : function(tag, callback){
		var delete_tag_query = "DELETE FROM tags WHERE id = ?";

		connection.query(delete_tag_query, tag.id, function(err, tag_results){
			if (err) throw err;

			callback(tag_results);
		});
	},
	deleteAllTag : function(callback){
		var delete_tags_query = "DELETE FROM tags";

		connection.query(delete_tags_query, tag_id, function(err, tag_results){
			if (err) throw err;

			callback(tag_results);
		});
	},
	updateTag : function(tag, callback){

		var update_tag_query = "UPDATE tags SET tag_name = ? WHERE id = ?";

		connection.query(update_tag_query, [tag.id, tag.tag_name], function(){
			if (err) throw err;

			callback(tag_results);
		});
	}

}