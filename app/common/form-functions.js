$(document).ready(function() {
    // The maximum number of options
    var MAX_OPTIONS = 5;

    $('#surveyForm')

        // Add button click handler
        .on('click', '.addButton', function() {
            var $template = $('#optionTemplate'),
                $clone    = $template
                                .clone()
                                .removeClass('hide')
                                .removeAttr('id')
                                .insertBefore($template),
                $option   = $clone.find('[name="option[]"]');

            // Add new field
			console.log("Voy a agregar "+$option);
            $('#thesubmit').prepend($option);
        })

        // Remove button click handler
        .on('click', '.removeButton', function() {
            var $row    = $(this).parents('.form-group'),
                $option = $row.find('[name="option[]"]');

            // Remove element containing the option
            $row.remove();

           
        })

        // Called after adding new field
        .on('added.field.fv', function(e, data) {
            // data.field   --> The field name
            // data.element --> The new field element
            // data.options --> The new field options

            if (data.field === 'option[]') {
                if ($('#surveyForm').find(':visible[name="option[]"]').length >= MAX_OPTIONS) {
                    $('#surveyForm').find('.addButton').attr('disabled', 'disabled');
                }
            }
        })

        // Called after removing the field
        .on('removed.field.fv', function(e, data) {
           if (data.field === 'option[]') {
                if ($('#surveyForm').find(':visible[name="option[]"]').length < MAX_OPTIONS) {
                    $('#surveyForm').find('.addButton').removeAttr('disabled');
                }
            }
        });
});