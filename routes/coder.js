var coderService = require('../services/coderService.js');

module.exports = {

	//Saves new coder to database and sends back response
	saveCoder : function(req, res){

		var coder = JSON.parse(JSON.stringify(req.body));

		coderService.saveCoder(coder, function(results){

			res.send(results);

		});
	}
};