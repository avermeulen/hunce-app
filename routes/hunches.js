var connection = require('../connection.js');
var hunchService = require('../services/hunchService.js');

module.exports = {
	newHunch : function(req, res){
		hunchService.newHunch(function(response){
			
			return res.render('hunch', response	);
		});
	},
	saveHunch : function(req, res){

		var hunchInfo = JSON.parse(JSON.stringify(req.body));

		if (hunchInfo["hunchDescription"] == "") {

			hunchService.newHunch(function(response){
				
				return res.render('hunch', {
									tags : response.tags,
									coders : response.coders,
									msg : "Hunch description cannot be empty!"
								});
			});

		}
		else if(hunchInfo["coders[]"] == undefined){

			hunchService.newHunch(function(response){
				
				return res.render('hunch', {
									tags : response.tags,
									coders : response.coders,
									msg : "Tag at least one coder in your hunch!",
									hunchDescription : hunchInfo["hunchDescription"]
								});
			});

		}
		else if(hunchInfo["tags[]"] == undefined){

			hunchService.newHunch(function(response){
				
				return res.render('hunch', {
									tags : response.tags,
									coders : response.coders,
									msg : "Put some tags in your hunch!",
									hunchDescription : hunchInfo["hunchDescription"]
								});
			});

		} else{

			hunchService.saveHunch(hunchInfo, function(response){
				return res.redirect('/');	
			});
		};
	},
	getHunches : function(req, res){
    
    	hunchService.getHunches(function(response){

		    return res.render('hunches', {
		    								hunches : response
		    							});
    	});

	},
	editHunch : function(req, res){

    	var hunch_id = req.params.id;
		
		hunchService.editHunch(hunch_id, function(response){

            res.render('edit_hunch', {
        								hunch : response.hunch_results,
        								hunch_coders : response.hunch_coders_results,
        								hunch_tags : response.hunch_tags_results,
        								coders : response.coders_results,
        								tags : response.tags_results
        							});
        });
	},
	updateHunch : function(req, res){

		var hunchInfo = JSON.parse(JSON.stringify(req.body));
		var hunch_id = req.params.id;
		 
		hunchService.updateHunch(hunch_id, hunchInfo, function(response){

			return res.redirect("/");
		});
	},
	deleteHunch : function(req, res){

		//Get hunch id as request parameter
		var hunch_id = req.params.id;

		hunchService.deleteHunch(hunch_id, function(response){
			res.redirect('/');
		});
	},
	searchHunches : function(req, res){

		var searchString = req.query.searchString;

    	hunchService.searchHunches(searchString, function(response){

    		var searchResults = response;
    		
		    return res.send(searchResults);

		});
	}
}