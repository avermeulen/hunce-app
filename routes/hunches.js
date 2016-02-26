var hunchService = require('../services/hunchService.js'),
	tagService = require('../services/tagService.js');


module.exports = {

	// [newHunch] function renders page to create new hunch
	newHunch : function(req, res){
		hunchService.newHunch(function(response){
			
			return res.render('hunch', response	);
		});
	},

	// [saveHunch] function saves new hunch to the database
	saveHunch : function(req, res){

		var hunchInfo = JSON.parse(JSON.stringify(req.body));

		// If hunch description is empty redirect to same page with a message
		if (hunchInfo["hunchDescription"] == "") {

			hunchService.newHunch(function(response){
				
				return res.render('hunch', {
									tags : response.tags,
									coders : response.coders,
									msg : "Hunch description cannot be empty!"
								});
			});
		}
		// Else if no coders tagged then redirect to same page with a message
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

		// Else if no tags then redirect to same page with a message
		else if(hunchInfo["tags[]"] == undefined){

			hunchService.newHunch(function(results){
				
				return res.render('hunch', {
									tags : results.tags,
									coders : results.coders,
									msg : "Put some tags in your hunch!",
									hunchDescription : hunchInfo["hunchDescription"]
								});
			});

		} 
		//Save hunch to database and redirect to home page when all conditions are met
		else{

			hunchService.saveHunch(hunchInfo, function(response){
				return res.redirect('/');	
			});
		};
	},

	// Displays all the hunches from database on home page
	getHunches : function(req, res){
    
    	hunchService.getHunches(function(response){

		    return res.render('hunches', {
		    								hunches : response
		    							});
    	});

	},

	// Render the information of a hunch to be editted
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

	// Saves editted hunch to database
	updateHunch : function(req, res){

		var hunchInfo = JSON.parse(JSON.stringify(req.body));
		var hunch_id = req.params.id;
		 
		hunchService.updateHunch(hunch_id, hunchInfo, function(response){

			return res.redirect("/");
		});
	},

	// Delete selected hunch
	deleteHunch : function(req, res){

		//Get hunch id as request parameter
		var hunch_id = req.params.id;

		hunchService.deleteHunch(hunch_id, function(response){
			res.redirect('/');
		});
	},

	// Search through hunches for given search string
	searchHunches : function(req, res){

		var searchString = req.query.searchString;

    	hunchService.searchHunches(searchString, function(response){

    		var searchResults = response;
    		
		    return res.send(searchResults);

		});
	}
}