var connection = require('../connection.js');

module.exports = {

	// Link coder to a specific hunch in the coder_hunch table
	saveCoderHunch : function(coder_hunch_paired_ids, callback){

		var sql_query = 'INSERT INTO coder_hunch (hunch_id, coder_id) VALUES' + coder_hunch_paired_ids;
		
		connection.query(sql_query, function(err, coderHunchResults) {
			if (err) throw err;

			callback(coderHunchResults);
		});
	},

	deleteCoderHunch : function(hunch_id, callback){

		var delete_coder_query = "DELETE FROM coder_hunch " +
								"WHERE hunch_id = ?";

		connection.query(delete_coder_query, hunch_id, function(err, coder_results){
			if (err) throw err;

			callback(coder_results);
		});

	}
}