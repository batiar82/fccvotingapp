$(document).ready(function() {
    // The maximum number of options
    var MAX_OPTIONS = 5;

    $('.thesubmit')
       .on('click', function(event) {
           event.preventDefault();
            console.log("Click en submit");
            $.post( "/api/poll/addOption",{id: $('.thesubmit').data("id"), option: $('.theoption').val()},function(data){
                console.log("vuelve "+data);
            });
        });
});