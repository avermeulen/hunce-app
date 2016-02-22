$(document).ready(function(){
    $selectCoders = $('#select-coders').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: false,
            selectOnTab : true
        });

    $selectTags = $('#select-tags').selectize({
        plugins: ['restore_on_backspace', 'remove_button'],
        delimiter: ',',
        persist: false,
        selectOnTab : true,
        create: function(input, callback) {

            $.post("/tags/add", {tag_name : input}, function(response){

                response = response.tag_results ;

                callback    ({
                    value: response.insertId || response[0].id,
                    text: input
                });
            });
        }   
    });
});