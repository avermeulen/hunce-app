$(document).ready(function(){

    // [START] [Selectize.js] Adding coders to hunch
    $selectCoders = $('#select-coders').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: false,
            selectOnTab : true
        });
    // [END] [Selectize.js] Adding coders to hunch

    // [START] [Selectize.js] Adding tags to hunch
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
    // [END] [Selectize.js] Adding tags to hunch

    // [START] Description characters remaing

    if ($("div[name=remaining-characters]").exists) {

        $("div[name=remaining-characters]").text(
            "Remaing: (" + (200-$($("textarea[name=hunchDescription]")).val().length) + ")"
            );

        $("textarea[name=hunchDescription]").keyup(function(){

            $("div[name=remaining-characters]").text("Remaing: (" + (200-$(this).val().length) + ")");
        });
    };
    // [End] Description characters remaing

    // [START] Confirm delete functionality
    $('[data-toggle="confirmation"]').confirmation({
        btnOkLabel : "Yes",
        btnCancelLabel : "No"
    });
    // [END] Confirm delete functionality
});