module.exports = {
	// Form a string like this : (1,2,3) for sql IN operator
	sql1_list_string : function(array){

		if (typeof(array) == "object") {
			var ids = "";
			array.forEach(function(item, index){
				ids += item.id;
				if (index < array.length-1) {
					ids += ",";
				};
			});

			ids = "(" + ids + ")";

			return ids
		} else {

			return "(" + array.id + ")";
		}
	},
	
	// Make the string so value = (field, constantField),(field, constantField) and on
	values_to_insert : function(fieldsArray, constantField){

		if (typeof(fieldsArray) == "object") {
			
			var values = "";
			
			fieldsArray.forEach(function(tag_id, index){
				
				values += "(" + constantField + "," + tag_id + ")";

				if (index < fieldsArray.length-1) {
					values += ","
				}
			});

			return values;

		}else{

			var values = "(" + constantField + "," + fieldsArray + ")";;

			return values;

		}
	}
}