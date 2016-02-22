var tagService = require('../services/tagService.js');

module.exports = {
	saveTag : function(req, res){

		var tag = JSON.parse(JSON.stringify(req.body));

		tagService.saveTag(tag, function(results){

			res.send(results);

		});

	}
};