var connection = require('../connection.js');

module.exports = {

	// Link tag to a specific hunch in the tag_hunch table
	saveTagHunch : function(tag_hunch_paired_ids, callback){

		var sql_query = 'INSERT INTO tag_hunch (hunch_id, tag_id) VALUES' + tag_hunch_paired_ids;

		connection.query(sql_query, function(err, tagHunchResults) {
			if (err) throw err;

			callback(tagHunchResults);
		});
	},

	deleteTagHunch : function(hunch_id, callback){

		var delete_tag_query = "DELETE FROM tag_hunch " +
								"WHERE hunch_id = ?";

		connection.query(delete_tag_query, hunch_id, function(err, tag_results){
			if (err) throw err;

			callback(tag_results);
		});

	}
}