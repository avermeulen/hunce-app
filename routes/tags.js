var tagService = require('../services/tagService.js');

module.exports = {

	//Saves new tag to database and sends back response
	saveTag : function(req, res){

		var tag = JSON.parse(JSON.stringify(req.body));

		tagService.saveTag(tag, function(results){

			res.send(results);

		});

	}
};