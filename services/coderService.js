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

					callback({coder_results : coder_results});

				});
			}
			else if (coder_results.name || coder_results[0].name) {

				callback({coder_results : coder_results});

			} 

		});

	},
	getAllCoders : function(callback){
		var select_coders_query = "SELECT name FROM coders";

		connection.query(select_coders_query, function(err, coder_results){
			if (err) throw err;

			callback({coder_results : coder_results});
		});
	},
	getCoder : function(coder, callback){
		var select_coder_query = "SELECT name FROM coders WHERE id = ?";

		connection.query(select_coder_query, coder.id, function(err, coder_results){
			if (err) throw err;

			callback({coder_results : coder_results});
		});
	},
	getCoderHunch : function(hunch_id, callback){

		var select_coder_query = "SELECT coder_id, name " +
								"FROM coders " +
								"INNER JOIN coder_hunch " +
								"ON coder_id = coders.id " +
								"WHERE hunch_id = ?";

		connection.query(select_coder_query, hunch_id, function(err, coder_results){
			if (err) throw err;

			callback({coder_results : coder_results});
		});

	},
	deleteCoderHunch : function(hunch_id, callback){

		var delete_coder_query = "DELETE FROM coder_hunch " +
								"WHERE hunch_id = ?";

		connection.query(delete_coder_query, hunch_id, function(err, coder_results){
			if (err) throw err;

			callback({coder_results : coder_results});
		});

	},
	deleteCoder : function(coder, callback){
		var delete_coder_query = "DELETE FROM coders WHERE id = ?";

		connection.query(delete_coder_query, coder.id, function(err, coder_results){
			if (err) throw err;

			callback({coder_results : coder_results});
		});
	},
	deleteAllCoder : function(callback){
		var delete_coders_query = "DELETE FROM coders";

		connection.query(delete_coders_query, coder_id, function(err, coder_results){
			if (err) throw err;

			callback({coder_results : coder_results});
		});
	},
	updateCoder : function(coder, callback){

		var update_coder_query = "UPDATE coders SET name = ? WHERE id = ?";

		connection.query(update_coder_query, [coder.id, coder.name], function(){
			if (err) throw err;

			callback({coder_results : coder_results});
		});
	}
}