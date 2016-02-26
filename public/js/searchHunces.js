$(document).ready(function(){

	$("input#searchHunces").val("");

	$("input#searchHunces").keyup(function(){

		// [START] JQuery get search data
		$.get("/search/hunches", {searchString : $(this).val()}, function(searchResults){

			// Empty hunches table
			$("table#hunchesTable tbody").empty();

			// [START] Re-populate hunches table with search data
			searchResults.forEach(function(hunch){

				$("table#hunchesTable tbody").append("<tr>" +
					" <td> <img border=\"0\" src=\"/emoticons/" + hunch.rating + ".gif\"/></td> " +
                    " <td>" + hunch.date_created + "</td> " +
                    " <td>" + hunch.coders + "</td> " +
                    " <td>" + hunch.tags + "</td> " +
                    " <td> " + hunch.description + "</td> " +
                    " <td>" +
                    	"<a class=\"editHunch btn btn-default\" href=\"/hunch/edit/" + hunch.id + "\">Edit</a>" + 
                    "</td> " +
                    " <td>" +
                    	"<a class=\"deleteHunch btn btn-default\" data-placement=\"top\" data-toggle=\"confirmation\" data-href=\"/hunch/delete/" + hunch.id + "\">Delete</a>" +
                    " </td>" +
                	" </tr>"
                );
			});
			// [END] Re-populate hunches table with search data

			// [START] Confirm delete functionality
			$('[data-toggle="confirmation"]').confirmation({
			    btnOkLabel : "Yes",
			    btnCancelLabel : "No"
			});
			// [END] Confirm delete functionality
		});
		// [END] JQuery get search data
	});
});