var connection = require('../connection.js');

module.exports = {
	saveTag : function(tag, callback){

		var select_tag_query = "SELECT tag_name FROM tags WHERE id = ?";
		var insert_tag_query = "INSER INTO tags (tag_name) VALUES(?)";

		connection.query(select_tag_query, tag.tag_name, function(err, tag_results){
			if (err) throw err;

			if (tag_results.tag_name) {

				callback({tag_results : tag_results});

			} else {
				connection.query(insert_tag_query, tag.tag_name, function(err, tag_results){
					if (err) throw err;

					callback({tag_results : tag_results});

				});
			}

		});

	},
	getAllTags : function(callback){
		var select_tags_query = "SELECT tag_name FROM tags";

		connection.query(select_tags_query, function(err, tag_results){
			if (err) throw err;

			callback({tag_results : tag_results});
		});
	},
	getTag : function(tag, callback){
		var select_tag_query = "SELECT tag_name FROM tags WHERE id = ?";

		connection.query(select_tag_query, tag.id, function(err, tag_results){
			if (err) throw err;

			callback({tag_results : tag_results});
		});
	},
	deleteTag : function(tag, callback){
		var delete_tag_query = "DELETE FROM tags WHERE id = ?";

		connection.query(delete_tag_query, tag.id, function(err, tag_results){
			if (err) throw err;

			callback({tag_results : tag_results});
		});
	},
	deleteAllTag : function(callback){
		var delete_tags_query = "DELETE FROM tags";

		connection.query(delete_tags_query, tag_id, function(err, tag_results){
			if (err) throw err;

			callback({tag_results : tag_results});
		});
	},
	updateTag : function(tag, callback){

		var update_tag_query = "UPDATE tags SET tag_name = ? WHERE id = ?";

		connection.query(update_tag_query, [tag.id, tag.tag_name], function(){
			if (err) throw err;

			callback({tag_results : tag_results});
		});
	}

}