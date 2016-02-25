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
        persist: true,
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

    //Calculate characters remaining in description

    if ($("div[name=remaining-characters]").exists) {

        $("div[name=remaining-characters]").text(
            "Remaing: (" + (200-$($("textarea[name=hunchDescription]")).val().length) + ")"
            );

        $("textarea[name=hunchDescription]").keyup(function(){

            $("div[name=remaining-characters]").text("Remaing: (" + (200-$(this).val().length) + ")");
        });
    };
    //End of description length remaing

    $('[data-toggle="confirmation"]').confirmation({
        btnOkLabel : "Yes",
        btnCancelLabel : "No"
    });

});