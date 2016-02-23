$(document).ready(function(){

	$("input#searchHunces").keyup(function(){

		$.get("/search/hunches", {searchString : $(this).val()}, function(searchResults){

			$("table#hunchesTable tbody").empty();

			searchResults.forEach(function(hunch){

				$("table#hunchesTable tbody").append("<tr>" +
					" <td> <img border=\"0\" src=\"/emoticons/" + hunch.rating + ".gif\"/></td> " +
                    " <td>" + hunch.description + "</td> " +
                    " <td>" + hunch.coders + "</td> " +
                    " <td> " + hunch.tags + "</td> " +
                    " <td><a href=\"/hunch/edit/" + hunch.id + " \">Edit</a></td>" +
                    " <td><a href=\"/hunch/delete/" + hunch.id + " \">Delete</a></td> " +
                	" </tr>"
                );
			});
		});
	});
});