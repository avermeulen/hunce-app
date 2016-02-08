var connection = require('../connection.js');
 
module.exports = {
	saveHunce : function(req, res){

		var hunceInfo = JSON.parse(JSON.stringify(req.body));

		var today = new Date();
		 
		var hunch = {
			description : hunceInfo.hunceDescription,
			rating : hunceInfo.rating,
			date_created : new Date()
		};

		connection.query('INSERT INTO hunches (description, rating , date_created) VALUES(?,?,?)', [hunch.description, hunch.rating, hunch.date_created], function(err, insertResults) {
			if (err) throw err;

			console.log('Status: \n', insertResults, typeof(hunceInfo["coders[]"]));

			if (typeof(hunceInfo["tags[]"]) == "object") {

				var values = "";

				//Make the string so value = (hunch_id, tag_id),(hunch_id, tag_id) and on
				hunceInfo["tags[]"].forEach(function(tag_id, index){
					if (index < hunceInfo["tags[]"].length-1) {
						values += "(" + insertResults.insertId + "," + tag_id + "),";
					}
					else{
						values += "(" + insertResults.insertId + "," + tag_id + ")";
					};
				});
				connection.query('INSERT INTO tag_hunch (hunch_id, tag_id) VALUES' + values, function(err, tagHunchResults) {
					if (err) throw err;
				});

			} else{
				var tag_id = hunceInfo["tags[]"];

				connection.query('INSERT INTO tag_hunch (hunch_id, tag_id) VALUES(?,?)', [insertResults.insertId, tag_id], function(err, tagHunchResults) {
					if (err) throw err;
				});
			};

			if (typeof(hunceInfo["coders[]"]) == "object") {

				var values = '';

				//Make the string so value = (hunch_id, coder_id),(hunch_id, coder_id) and on
				hunceInfo["coders[]"].forEach(function(coder_id, index){
					if (index < hunceInfo["coders[]"].length-1) {
						values += "(" + insertResults.insertId + "," + coder_id + "),";
					}
					else{
						values += "(" + insertResults.insertId + "," + coder_id + ")";
					};
				});
				connection.query('INSERT INTO coder_hunch (hunch_id, coder_id) VALUES' + values, function(err, coderHunchResults) {
					if (err) throw err;
				});

			} else{
				var coder_id = hunceInfo["coders[]"];

				connection.query('INSERT INTO coder_hunch (hunch_id, coder_id) VALUES(?,?)', [insertResults.insertId, coder_id], function(err, coderHunchResults) {
					if (err) throw err;
				});
			};
		});

		return res.redirect('/');
	},
	getHunces : function(req, res){
    
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
			
			console.log(hunchResults);

		    return res.render('hunces', {
		    								hunches : hunchResults
		    							});

		});
	}
}