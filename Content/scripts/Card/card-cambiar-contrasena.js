var token = "";

$(document).ready(function () {
    $.ajax(window.config.urlbase + "/GetAccessToken", {
        beforeSend: showLoader,
        complete: hideLoader,
        success: function (data) {
            token = data.result;
        }
    });

    $("#cambiar-pass-form").submit(function (event) {
        event.preventDefault();
        $("#err").slideUp();
    });

    $("#cambiar-pass-form").validate({
        submitHandler: function (form) {
            submitPassword();
        },
        rules: {
            rfc: {
                required: true,
                minlength: 12,
                maxlength: 13
            },
            password: {
                required: true,
                confirmPassword: "confirm_password"
            },
            confirm_password: {
                required: true,
                confirmPassword: "password"
            }
        }
    });
});

function submitPassword() {
    var headers = {
        "Authorization": "Bearer " + token,
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
    };

    var body = {
        "rfc": $("#rfc").val(),
        "password": $("#password").val()
    };

    $.ajax(window.config.UrlMySalesforce + '/services/apexrest/SetPasswordSitefinity', {
        beforeSend: showLoader,
        complete: hideLoader,
        method: 'post',
        headers: headers,
        data: JSON.stringify(body),
        success: function (res) {
            console.log(res);

            $("#password").val("");
            $("#confirm_password").val("");

            if (res.isSuccess === "true") {
                $("#rfc").val("");
                Swal.fire({
                    icon: "success",
                    title: "Se ha cambiado la contraseña exitosamente"
                })
                    .then(() => {
                        window.location.replace(window.location.origin + "/tfsm/home-delivery");
                    })
            }
            else {
                $("#err").html(res.statusMessage);
                $("#err").slideDown();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}