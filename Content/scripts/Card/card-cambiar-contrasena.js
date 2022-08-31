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
                checkStrength: true                
            },
            confirm_password: {
                required: true,
                confirmPassword: "password"
            }
        }
    });

    /*---------------codigo para los iconos de las validaciones--------------------------*/

    $('#password').keyup(function () {
        var password = $('#password').val();
        checkStrength(password);
    });

    jQuery.validator.addMethod(
        "checkStrength",
        function (value, element) {
            if (checkStrength(value) == true)
                return true;
        }, "La contraseña no cumple con las condiciones"
    );

    function checkStrength(value) {
        var strength = 0;

        //si la contraseña posee un caracter mayuscula y minuscula.
        if (value.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
            strength += 1;
            $('.low-upper-case').addClass('text-success');
            $('.low-upper-case i').removeClass('fa-times').addClass('fa-check');

        } else {
            $('.low-upper-case').removeClass('text-success');
            $('.low-upper-case i').addClass('fa-times').removeClass('fa-check');
        }

        //si tiene numeros y letras.
        if (value.match(/([a-zA-Z])/) && value.match(/([0-9])/)) {
            strength += 1;
            $('.one-number').addClass('text-success');
            $('.one-number i').removeClass('fa-times').addClass('fa-check');

        } else {
            $('.one-number').removeClass('text-success');
            $('.one-number i').addClass('fa-times').removeClass('fa-check');
        }

        //si tiene caracteres especiales.
        // el @ anda a veces
        if (value.match(/([!,@,#,$,%,^,&,*,(,),_,+,-,=,{,},\,|,;,:,',,,.,?,/,`,~,>,<,\-,\\,\[,\]]+)/)) {
            strength += 1;
            $('.one-special-char').addClass('text-success');
            $('.one-special-char i').removeClass('fa-times').addClass('fa-check');

        } else {
            $('.one-special-char').removeClass('text-success');
            $('.one-special-char i').addClass('fa-times').removeClass('fa-check');
        }

        if (value.length > 7) {
            strength += 1;
            $('.eight-character').addClass('text-success');
            $('.eight-character i').removeClass('fa-times').addClass('fa-check');

        } else {
            $('.eight-character').removeClass('text-success');
            $('.eight-character i').addClass('fa-times').removeClass('fa-check');
        }

        if (strength == 4) {
            return true;
        }
    }
        /*---------------fin codigo para los iconos de las validaciones--------------------------*/

    
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

    $.ajax(window.config.urlbase + '/SetPassword', {
        beforeSend: showLoader,
        complete: hideLoader,
        method: 'POST',
        headers: headers,
        data: JSON.stringify(body),
        success: function (res) {
            res = JSON.parse(res);
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
            Swal.fire({
                icon: "error",
                title: "La contraseña no se puede restablecer en este momento. Inténtelo dentro de 24 horas."
            })
                .then(() => {
                    window.location.replace(window.location.origin + "/tfsm/home-delivery");
                })
        }
    });
}
