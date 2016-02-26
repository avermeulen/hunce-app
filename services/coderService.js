var connection = require('../connection.js');

module.exports = {
	saveCoder : function(coder, callback){

		var select_coder_query = "SELECT name FROM coders WHERE name = ?";

		connection.query(select_coder_query, coder.name, function(err, coder_results){
			if (err) throw err;

			console.log(coder_results);

			if(coder_results.length == []) {

				var insert_coder_query = "INSERT INTO coders (name) VALUES(?)";

				connection.query(insert_coder_query, coder.name, function(err, coder_results){
					if (err) throw err;

					callback(coder_results);

				});
			}
			else if (coder_results.name || coder_results[0].name) {

				callback(coder_results);

			} 

		});

	},
	getAllCoders : function(callback){
		var select_coders_query = "SELECT id, name FROM coders";

		connection.query(select_coders_query, function(err, coder_results){
			if (err) throw err;

			callback(coder_results);
		});
	},
	getCoder : function(coder_id, callback){
		var select_coder_query = "SELECT name FROM coders WHERE id = ?";

		connection.query(select_coder_query, coder_id, function(err, coder_results){
			if (err) throw err;

			callback(coder_results);
		});
	},
	getCodersOfHunch : function(hunch_id, callback){

		var select_coder_query = "SELECT coders.id, coders.name " +
								"FROM coders " +
								"INNER JOIN coder_hunch " +
								"ON coder_id = coders.id " +
								"WHERE hunch_id = ?";

		connection.query(select_coder_query, hunch_id, function(err, coder_results){
			if (err) throw err;

			callback(coder_results);
		});

	},

	getCoders_NOT_inList : function(coder_ids, callback){

		var select_coder_query = "SELECT id, name " +
    							"FROM coders " +
    							"WHERE id NOT in " + coder_ids;

		connection.query(select_coder_query, function(err, coder_results){
			if (err) throw err;

			callback(coder_results);
		});

	},
	deleteCoder : function(coder, callback){
		var delete_coder_query = "DELETE FROM coders WHERE id = ?";

		connection.query(delete_coder_query, coder.id, function(err, coder_results){
			if (err) throw err;

			callback(coder_results);
		});
	},
	deleteAllCoder : function(callback){
		var delete_coders_query = "DELETE FROM coders";

		connection.query(delete_coders_query, coder_id, function(err, coder_results){
			if (err) throw err;

			callback(coder_results);
		});
	},
	updateCoder : function(coder, callback){

		var update_coder_query = "UPDATE coders SET name = ? WHERE id = ?";

		connection.query(update_coder_query, [coder.id, coder.name], function(){
			if (err) throw err;

			callback(coder_results);
		});
	}
}