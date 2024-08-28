$(document).ready(function () {
    $("#plan-form").validate({
        rules: {
            name: {
                required: true,
                isValidName: true,
                minlength: 3
            },
            lastname: {
                required: true,
                isValidName: true,
                minlength: 3
            }
        }
    });
});
