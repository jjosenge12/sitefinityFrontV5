﻿var token;
$(document).ready(function () {

    $(document).keydown(function (objEvent) {
        if (objEvent.keyCode == 9) {
            objEvent.preventDefault();
        }
    });

    var swiper;
    if (window.location.search.includes("cp")) {
        const urlParams = new URLSearchParams(window.location.search);
        var error = urlParams.get("cp");
        switch (error) {
            case '1':
                Swal.fire({
                    icon: "success",
                    title: "Se ha enviado el mail para el cambio de contraseña"
                })
                break;
        }

    }

    if (window.location.search.includes("err")) {
        const urlParams = new URLSearchParams(window.location.search);
        var error = urlParams.get("err").split('.');
        switch (error[0]) {

            case '1':
                swiper = new Swiper('.swiper-container', {
                    speed: 400,
                    allowTouchMove: false,
                    initialSlide: 0
                });
                $(document).unbind('keydown');
                $("#userVisible").focus();

                $(document).keydown(function (e) {
                    if (e.keyCode == 9 || e.which == 9) {
                        if (document.activeElement.classList[0] == 'btn-registro')
                            $("#volver-nc").focus();
                    }
                    if (e.keyCode == 13 || e.which == 13) {
                        $("#boton-login-nocliente").click();
                    }
                });

                switch (error[1]) {
                    case '1':
                        $("#err-nocliente").html(`Usuario o contraseña incorrectos`);
                        $("#err-nocliente").show();
                        break;

                }

                break;


            case '2':
                swiper = new Swiper('.swiper-container', {
                    speed: 400,
                    allowTouchMove: false,
                    initialSlide: 3
                });
                $(document).unbind('keydown');
                $(document).keydown(function (e) {
                    if (e.keyCode == 9 || e.which == 9) {
                        if (document.activeElement.classList[0] == 'btn-registro')
                            $("#volver-c").focus();
                    }
                    if (e.keyCode == 13 || e.which == 13) {
                        $("#boton-login-cliente").click();
                    }
                });

                switch (error[1]) {
                    case '1':
                        $("#err-cliente").html(`Usuario o contraseña incorrectos`);
                        $("#err-cliente").show();
                        break;
                    case '2':
                        $("#err-cliente").html(`No es posible iniciar sesión con esta Cuenta, favor de enviar un correo electrónico a <a style="text-decoration:none;color:#121212;font-weight:600;" href="mailto:servicioalcliente@toyota.com">servicioalcliente@toyota.com</a>`);
                        $("#err-cliente").show();
                        break;

                }
                break;


            case '4':
                swiper = new Swiper('.swiper-container', {
                    speed: 400,
                    allowTouchMove: false,
                    initialSlide: 6
                });
                $(document).unbind('keydown');
                $(document).keydown(function (e) {
                    if (e.keyCode == 9 || e.which == 9) {
                        if (document.activeElement.classList[0] == 'btn-registro')
                            $("#volver-inicio-nc").focus();
                    }
                    if (e.keyCode == 13 || e.which == 13) {
                        $("#boton-registro-nocliente").click();
                    }
                });
                $('input:checkbox').keypress(function (e) {
                    if ((e.keyCode ? e.keyCode : e.which) == 13) {
                        $(this).trigger('click');
                        $(termsCheckbox).prop("checked", false);

                    }
                });

                switch (error[1]) {
                    case '0':
                        $("#err-nc").html(`Este usuario ya se encuentra registrado, te pedimos hacer clic<span class="black-link" id="error-lognc"> aquí </span>para ingresar.
                Para ingresar deberás registrarte con el usuario y contraseña ingresados anteriormente.
                        <script>
                        swiper2 = new Swiper('.swiper-container', {
                        speed: 400,
                        allowTouchMove: false,
                        initialSlide: 6});
                        $("#error-lognc").click(() => {swiper2.slideTo(0);$("#err-nc").remove() });
                        
                        $("#al-registro-nc").click(() => swiper2.slideTo(6));
                        </script>`);
                        $("#err-nc").show();

                        break;
                    case '1':
                        $("#err-nc").html(`Este usuario ya se encuentra registrado, te pedimos hacer clic <span class="black-link" id="error-logc">aquí</span> para ingresar.
                Para ingresar deberás registrarte con el usuario y contraseña ingresados anteriormente.
                        <script>swiper = new Swiper('.swiper-container', {
                        speed: 400,
                        allowTouchMove: false,
                        initialSlide: 6});
                        $("#error-logc").click(() => {swiper.slideTo(3);$("#err-nc").remove()});
                        </script>`);
                        $("#err-nc").show();
                        break;
                    case '2':
                        $("#err-nc").html(`Ya existe un cliente con esos datos, te pedimos hacer clic <span id="error-trc" class="black-link">aquí</span> para ingresar.
                Para ingresar deberás registrarte con el usuario y contraseña ingresados anteriormente.
                        <script>swiper = new Swiper('.swiper-container', {
                        speed: 400,
                        allowTouchMove: false,
                        initialSlide: 6});
                        $("#error-trc").click(() => {swiper.slideTo(5);$("#err-nc").remove()});
                        </script>`);
                        $("#err-nc").show();
                        break;
                    case '3':
                        $("#err-nc").html(`Error inesperado`);
                        $("#err-nc").show();
                        break;

                }
                break;
            case '3':
                swiper = new Swiper('.swiper-container', {
                    speed: 400,
                    allowTouchMove: false,
                    initialSlide: 5
                });
                $(document).unbind('keydown');
                $(document).keydown(function (e) {
                    if (e.keyCode == 9 || e.which == 9) {
                        if (document.activeElement.classList[0] == 'btn-registro')
                            $("#volver-inicio-c").focus();
                    }
                    if (e.keyCode == 13 || e.which == 13) {
                        $("#boton-registro-cliente").click();
                    }
                });
                $('input:checkbox').keypress(function (e) {
                    if ((e.keyCode ? e.keyCode : e.which) == 13) {
                        $(this).trigger('click');
                        $(termsCheckbox).prop("checked", false);

                    }
                });

                switch (error[1]) {
                    case '7':
                        $("#err-c").html(`No existe cliente con RFC o ID de Cliente`);
                        $("#err-c").show();
                        break;
                    case '10':
                        $("#err-c").html(`El número de cliente ingresado tiene un correo diferente registrado, verifique que la información ingresada sea igual a la registrada en el contrato que firmó, si la ha olvidado deberá enviar un correo electrónico a servicioalcliente@toyota.com solicitando asesoría`);
                        $("#err-c").show();
                        break;
                    case '6':
                        $("#err-c").html(`Ya se ha registrado previamente con este email. Intente reestablecer su contraseña.`);
                        $("#err-c").show();
                        break;
                    case '5':
                        $("#err-c").html(`Error inesperado`);
                        $("#err-c").show();
                        break;
                    case '9':
                        $("#err-c").html(`Ya hay un usuario registrado con ese id de cliente. Verifique que la información ingresada sea igual a la registrada en el contrato que firmó, si la ha olvidado enviar un correo electrónico a servicioalcliente@toyota.com solicitando asesoría.`);
                        $("#err-c").show();
                        break;
                }
                break;
        }


    }
    else {
        if (window.location.search.includes("ok")) {
            const urlParams = new URLSearchParams(window.location.search);
            var ok = urlParams.get("ok").split('?');
            switch (ok[0]) {
                case '1':
                    swiper = new Swiper('.swiper-container', {
                        speed: 400,
                        allowTouchMove: false,
                        initialSlide: 7
                    });
                    break;
            }
        }
        else {
            swiper = new Swiper('.swiper-container', {
                speed: 400,
                allowTouchMove: false,
                initialSlide: 1
            });
        }
    }


    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    $("#boton-login-nocliente").click(function (e) {
        if ($("#nc-form").valid()) {
            var pass = document.getElementById("passVisible").value;
            var user = document.getElementById("userVisible").value;
            var data = {
                idCliente_email: user,
                password: pass,
                esCliente: "false"
            };
            inicio_sesion(data,1);
        }
    });

    $("#boton-login-cliente").click(function (e) {
        if ($("#c-form").valid()) {
            var pass = document.getElementById("passClientVisible").value;
            var user = document.getElementById("clientVisible").value;
            var data = {
                idCliente_email: user,
                password: pass,
                esCliente: "true"
            };
            inicio_sesion(data);
        }
    });

    $("#recuperar-c-form").submit(function (e) {
        encrypt_log(true);
    });

    $("#recuperar-nc-form").submit(function (e) {
        var rfc = document.getElementById("rfcVisible").value;
        var email = document.getElementById("emailVisible").value;
        var fail = document.getElementById("fail").value;
        var ok = document.getElementById("ok").value;
        var rfc_enc = window.btoa(rfc);
        var email_enc = window.btoa(email);
        var fail_enc = window.btoa(fail);
        var ok_enc = window.btoa(ok);
        document.getElementById("rfc").value = rfc_enc;
        document.getElementById("email").value = email_enc;
        document.getElementById("fail").value = fail_enc;
        document.getElementById("ok").value = ok_enc;
    });

    function encrypt_log(isClient) {

        if (isClient) {
            var clientId = document.getElementById("clientVisible").value;
            var clientId_enc = window.btoa(clientId);
            document.getElementById("client").value = clientId_enc;
        }
        else {
            var name = document.getElementById("nameVisible").value;
            var lastname = document.getElementById("lastnameVisible").value;

            var name_enc = window.btoa(name);
            var lastname_enc = window.btoa(lastname);

            document.getElementById("name").value = name_enc;
            document.getElementById("lastname").value = lastname_enc;
        }

        var rfc = document.getElementById("rfcVisible").value;
        var email = document.getElementById("emailVisible").value;
        var fail = document.getElementById("fail").value;
        var ok = document.getElementById("ok").value;
        var rfc_enc = window.btoa(rfc);
        var email_enc = window.btoa(email);
        var fail_enc = window.btoa(fail);
        var ok_enc = window.btoa(ok);
        document.getElementById("rfc").value = rfc_enc;
        document.getElementById("email").value = email_enc;
        document.getElementById("fail").value = fail_enc;
        document.getElementById("ok").value = ok_enc;

    }

    $("#volver-nc").click(function (e) {
        e.preventDefault();
    });
    $("#ingreso-no-clientes").click(() => {
        swiper.slideTo(0)
        $(document).unbind('keydown');
        $("#userVisible").focus();

        $(document).keydown(function (e) {
            if (e.keyCode == 9 || e.which == 9) {
                if (document.activeElement.classList[0] == 'btn-registro')
                    $("#volver-nc").focus();
            }
            if (e.keyCode == 13 || e.which == 13) {
                $("#boton-login-nocliente").click();
            }
        });

    });
    $("#ingreso-clientes").click(() => {
        swiper.slideTo(3)
        $(document).unbind('keydown');
        $(document).keydown(function (e) {
            if (e.keyCode == 9 || e.which == 9) {
                if (document.activeElement.classList[0] == 'btn-registro')
                    $("#volver-c").focus();
            }
            if (e.keyCode == 13 || e.which == 13) {
                $("#boton-login-cliente").click();
            }
        });

    });
    $("#volver-c").click(() => {
        swiper.slideTo(2)
        $(document).keydown(function (objEvent) {
            if (objEvent.keyCode == 9) {
                objEvent.preventDefault();
            }
        });
    });
    $("#volver-nc").click(() => {
        swiper.slideTo(2)
        $(document).keydown(function (objEvent) {
            if (objEvent.keyCode == 9) {
                objEvent.preventDefault();
            }
        });
    });
    $("#volver-inicio").click(() => swiper.slideTo(1));
    $("#volver-inicio-reg").click(() => swiper.slideTo(1));
    $("#volver-inicio-nc").click(() => swiper.slideTo(4));
    $("#volver-inicio-c").click(() => swiper.slideTo(4));
    $("#back-button-re").click(() => swiper.slideTo(1));
    $("#ingresar").click(() => {
        swiper.slideTo(2)
        $(document).keydown(function (objEvent) {
            if (objEvent.keyCode == 9) {
                objEvent.preventDefault();
            }
        });
    });
    $("#registro").click(() => swiper.slideTo(4));
    $("#registro-2").click(() => swiper.slideTo(4));
    $("#registro-clientes").click(() => {
        swiper.slideTo(5);
        $(document).unbind('keydown');
        $(document).keydown(function (e) {
            if (e.keyCode == 9 || e.which == 9) {
                if (document.activeElement.classList[0] == 'btn-registro')
                    $("#volver-inicio-c").focus();
            }
            if (e.keyCode == 13 || e.which == 13) {
                $("#boton-registro-cliente").click();
            }
        });
        $('input:checkbox').keypress(function (e) {
            if ((e.keyCode ? e.keyCode : e.which) == 13) {
                $(this).trigger('click');
                $(termsCheckbox).prop("checked", false);

            }
        });

    });
    $("#registro-no-clientes").click(() => {
        swiper.slideTo(6)
        $(document).unbind('keydown');
        $(document).keydown(function (e) {
            if (e.keyCode == 9 || e.which == 9) {
                if (document.activeElement.classList[0] == 'btn-registro')
                    $("#volver-inicio-nc").focus();
            }
            if (e.keyCode == 13 || e.which == 13) {
                    $("#boton-registro-nocliente").click();
            }
        });
        $('input:checkbox').keypress(function (e) {
            if ((e.keyCode ? e.keyCode : e.which) == 13) {
                $(this).trigger('click');
                $(termsCheckbox).prop("checked", false);

            }
        });
    });
    $("#al-registro").click(() => {
        swiper.slideTo(5);
        $(document).unbind('keydown');
        $(document).keydown(function (e) {
            if (e.keyCode == 9 || e.which == 9) {
                if (document.activeElement.classList[0] == 'btn-registro')
                    $("#volver-inicio-c").focus();
            }
            if (e.keyCode == 13 || e.which == 13) {
                $("#boton-registro-cliente").click();
            }

        });
        $('input:checkbox').keypress(function (e) {
            if ((e.keyCode ? e.keyCode : e.which) == 13) {
                $(this).trigger('click');
                $(termsCheckbox).prop("checked", false);

            }
        });
    });
    $("#al-registro-nc").click(() => {
        swiper.slideTo(6)
        $(document).unbind('keydown');
        $(document).keydown(function (e) {
            if (e.keyCode == 9 || e.which == 9) {
                if (document.activeElement.classList[0] == 'btn-registro')
                    $("#volver-inicio-nc").focus();
            }
            if (e.keyCode == 13 || e.which == 13) {
                $("#boton-registro-nocliente").click();
            }
        });
        $('input:checkbox').keypress(function (e) {
            if ((e.keyCode ? e.keyCode : e.which) == 13) {
                $(this).trigger('click');
                $(termsCheckbox).prop("checked", false);

            }
        });
    });

    $(".link-aviso-privacidad").click(function () {
        window.open(
            window.location.origin + "/legales/aviso-de-privacidad",
            "_blank"
        );
    });

    $("#nc-form").validate({
        rules: {
            _email: {
                required: true,
                isEmail: true
            },
            _password: {
                required: true
            }
        }
    });

    $("#c-form").validate({
        rules: {
            _clientId: {
                required: true
            },
            _password: {
                required: true
            }
        }
    });

    $("#recuperar-c-form").validate({
        submitHandler: function (form) {
            document.getElementById("clientVisible").removeAttribute("name");
            document.getElementById("rfcVisible").removeAttribute("name");
            document.getElementById("emailVisible").removeAttribute("name");

            $(form).ajaxSubmit();
        },
        rules: {
            _clientId: {
                required: true
            },
            _rfc: {
                required: true,
                minlength: 12,
                maxlength: 13
            },
            _email: {
                required: true,
                isEmail: true
            }
        }
    });

    $("#recuperar-nc-form").validate({
        submitHandler: function (form) {
            document.getElementById("rfcVisible").removeAttribute("name");
            document.getElementById("emailVisible").removeAttribute("name");

            $(form).ajaxSubmit();
        },
        rules: {
            _rfc: {
                required: true,
                minlength: 12,
                maxlength: 13
            },
            _email: {
                required: true,
                isEmail: true
            }
        }
    });

    $("#terms-btn").click(function () {
        termsCheckbox = "#registro-terms";
        openModal("newsletterTermsModal");
    });

    function inicio_sesion(data,prospecto = 0) {
        let datajson = JSON.stringify(data);
            $.ajax({
                type: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                url: window.config.urlbase + "/inicio_sesion",
                data: datajson,
                complete: hideLoader,
                success: function (result) {
                    result = JSON.parse(result);
                    console.log(result);
                    if (result.code == 1) {
                        sessionStorage.setItem("token", result.sessionId);
                        sessionStorage.setItem("email", result.Email);
                        sessionStorage.setItem("isClient", "true");
                        sessionStorage.setItem("isLogged", "true");
                        sessionStorage.setItem("lastname", result.Nombre);
                        sessionStorage.setItem("name", result.Nombre);
                        window.location = "/tfsm/mis-cotizaciones";
                    } else {
                        if (prospecto == 0) {
                            if (result.code == "2.1")
                                window.location.href = "/tfsm/home-delivery?err=2.1"
                            else
                                window.location.href = "/tfsm/home-delivery?err=2.2"
                        } else
                            window.location.href = "/tfsm/home-delivery?err=1.1"
                    }
                },
                error: function (err) {
                    console.log('Error en la conexion con SalesForce');
                }
            });
    }

});

