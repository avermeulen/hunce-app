module.exports = {
	values_to_insert : function(ids_to_insert, insertId){

		if (typeof(ids_to_insert) == "object") {
			
			var values = "";
			//Make the string so value = (hunch_id, tag_id),(hunch_id, tag_id) and on
			ids_to_insert.forEach(function(tag_id, index){
				
				values += "(" + insertId + "," + tag_id + ")";

				if (index < ids_to_insert.length-1) {
					values += ","
				}
			});

			return values;

		}else{

			var values = "(" + insertId + "," + ids_to_insert + ")";;

			return values;

		}
	},

	//Form a string like this : (1,2,3) for sql IN operator
	ids_list_string : function(array_of_ids){

		if (typeof(array_of_ids) == "object") {
			var ids = "";
			array_of_ids.forEach(function(id_object, index){
				ids += id_object.id;
				if (index < array_of_ids.length-1) {
					ids += ",";
				};
			});

			ids = "(" + ids + ")";

			return ids
		} else {

			return "(" + array_of_ids.id + ")";

		}
	}
}