var token ;

$(document).ready(function () {
  
    $(".sf-form-container.regis").each(function () {
        var form = document.createElement("form");

        form.innerHTML = this.innerHTML;
        Object.keys(this.dataset).forEach((x) => {
            form[x] = this.dataset[x];
        });

        $(this).html(form);
        FloatLabel.init();
    });

    $("#terms-btn").click(function () {
        console.log("entre");
        termsCheckbox = "#registro-terms";
     
        window.open(
            window.location.origin + "/terminos-de-servicio", 
            "_blank"
        );
    });

    $("#priv-cli-btn").click(function () {
        console.log("entre");
        termsCheckbox = "#registro-terms";

        window.open(
            window.location.origin + "/aviso-de-privacidad-para-clientes",
            "_blank"
        );
    });

    $("#priv-pros-btn").click(function () {
        console.log("entre");
        termsCheckbox = "#registro-terms";

        window.open(
            window.location.origin + "/legales/aviso-de-privacidad",
            "_blank"
        );
    });

    $("#registro-terms").click(function () {
        console.log("entre");
        termsCheckbox = "#registro-terms";
     
    });

    $("#terms-btn-nc").click(function () {
        console.log("entre");
        termsCheckbox = "#registro-terms";
   
        window.open(
            window.location.origin + "/terminos-de-servicio", 
            "_blank"
        );
    });

    $("#boton-registro-nocliente").click(function (e) {
        if ($("#registro-nc-form").valid()) {
            if ($("#registro-terms-nc").prop("checked")) {
                var data = {
                    rfcFull: document.getElementById("rfcVisible-nr").value,
                    name: document.getElementById("nameVisible-nr").value,
                    lastName: document.getElementById("lastnameVisible-nr").value,
                    email: document.getElementById("emailVisible-nr").value
                }
                registro(data, window.config.urlbase + '/RegistroPC', 0);
                //registro(data, window.config.urlToyotaCotizaciones + '/services/apexrest/SitefinityRegisterProspectoWS', 0);
            }
            else {
                e.preventDefault();
                termsCheckbox = "#registro-terms-nc";
                console.log("No estan aceptados el aviso de privacidad y los TyC");
            }
        }
        else {
            e.preventDefault();
        }
    });

    $("#registro-terms-c").click(function (e) {
        if ($("#registro-terms-c").prop("checked")) {
            e.preventDefault();
            termsCheckbox = "#registro-terms-c";
            openModal("avisoPrivClientesModal");
        }
    });

    $("#registro-terms-nc").click(function (e) {
        if ($("#registro-terms-nc").prop("checked")) {
            e.preventDefault();
            termsCheckbox = "#registro-terms-nc";
            openModal("avisoPrivClientesModal");// ver que aviso de privacidad mostrar, si el clientes o pospectos ??????
        }
    });

    $("#denyAvisoPriv").click(function () {
        console.log(termsCheckbox);
        $(termsCheckbox).prop("checked", false);
        closeModal("avisoPrivClientesModal");
    });

    $("#acceptAvisoPriv").click(function () {
        console.log(termsCheckbox);
        $(termsCheckbox).prop("checked", true);
        closeModal("avisoPrivClientesModal");
    });

    $("#closeAviPrivCli").click(() => closeModal("avisoPrivClientesModal"));

    $("#boton-registro-cliente").click(function (e) {
        if ($("#registro-c-form").valid()) {
            if ($("#registro-terms-c").prop("checked")) {
                var data = {
                    rfcFull: document.getElementById("rfcVisible-r").value,
                    idCliente: document.getElementById("clientVisible-r").value,
                    email: document.getElementById("emailVisible-r").value
                }
                registro(data, window.config.urlbase + '/RegistroPC', 1);
                //registro(data, window.config.urlToyotaCotizaciones + '/services/apexrest/SitefinityRegisterClientWS', 1);
            }
            else {
                e.preventDefault();
                termsCheckbox = "#registro-terms-c";
                console.log("No estan aceptados el aviso de privacidad y los TyC");
            }
        }
        else {
            e.preventDefault();
        }
    });
   
   
    

    function encrypt_reg(isClient) {

        if (isClient) {
            var clientIdr = document.getElementById("clientVisible-r").value;
            var clientId_encr = window.btoa(clientIdr);
            document.getElementById("client-r").value = clientId_encr;
            var rfcr = document.getElementById("rfcVisible-r").value;
            var emailr = document.getElementById("emailVisible-r").value;
            var failr = document.getElementById("fail-r").value;
            var okr = document.getElementById("ok-r").value;
            var rfc_encr = window.btoa(rfcr);
            var email_encr = window.btoa(emailr);
            var fail_encr = window.btoa(failr);
            var ok_encr = window.btoa(okr);
            document.getElementById("rfc-r").value = rfc_encr;
            document.getElementById("email-r").value = email_encr;
            document.getElementById("fail-r").value = fail_encr;
            document.getElementById("ok-r").value = ok_encr;
        }
        else {
            var namer = document.getElementById("nameVisible-nr").value;
            var lastnamer = document.getElementById("lastnameVisible-nr").value;

            var name_encr = window.btoa(namer);
            var lastname_encr = window.btoa(lastnamer);

            document.getElementById("name-nr").value = name_encr;
            document.getElementById("lastname-nr").value = lastname_encr;
            var rfcr = document.getElementById("rfcVisible-nr").value;
            var emailr = document.getElementById("emailVisible-nr").value;
            var failr = document.getElementById("fail-nr").value;
            var okr = document.getElementById("ok-nr").value;
            var rfc_encr = window.btoa(rfcr);
            var email_encr = window.btoa(emailr);
            var fail_encr = window.btoa(failr);
            var ok_encr = window.btoa(okr);
            document.getElementById("rfc-nr").value = rfc_encr;
            document.getElementById("email-nr").value = email_encr;
            document.getElementById("fail-nr").value = fail_encr;
            document.getElementById("ok-nr").value = ok_encr;
            
        }
    }

    $(".link-aviso-privacidad").click(function () {
        window.open(
            window.location.origin + "/aviso-de-privacidad-para-clientes",
            "_blank"
        );
    });

    $("#registro-c-form").validate({
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

    $("#registro-nc-form").validate({
        rules: {
            _name: {
                required: true,
                isValidName: true,
                minlength: 2
            },
            _lastname: {
                required: true,
                isValidName: true,
                minlength: 2
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

    $("#reenviar").click(function () {
        let data = {
            email: sessionStorage.getItem("reg-email"),
            idUsuario: "null",
            url: window.location.origin
        }
        let token1 = sessionStorage.getItem("token");

        var headers = {
            "Authorization": "Bearer " + token1,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        };
        let datajson = JSON.stringify(data);
        $.ajax({
            url: window.config.urlbase + '/Put-mail',
            beforeSend: showLoader,
            complete: hideLoader,
            method: 'POST',
            headers: headers,
            data: datajson,
            error: function (res) {
                Swal.fire({
                    icon: "error",
                    title: "Ocurrio un error al intentar reenviar el mail"
                })
            },
            success: function (res) {
                Swal.fire({
                    icon: "success",
                    title: "Se ha reenviado el mail correctamente"
                })
            }
        })
    });

    


    function registro(data, url, cliente) {
        let datajson = JSON.stringify(data);
        console.log(datajson);
                $.ajax({
                    type: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token,
                    },
                    url: window.config.urlbase + '/RegistroPC',
                    beforeSend: showLoader,
                    data: datajson,
                    success: function (result) {
                        if (result.code == 200) {
                            console.log(result);
                            if (cliente == 1) {
                                sessionStorage.setItem("reg-client", true);
                                sessionStorage.setItem("reg-clientId", document.getElementById("clientVisible-r").value);
                                sessionStorage.setItem("reg-email", document.getElementById("emailVisible-r").value);
                                sessionStorage.setItem("reg-rfc", document.getElementById("rfcVisible-r").value);
                            }
                            else {
                                sessionStorage.setItem("reg-client", false);
                                sessionStorage.setItem("reg-name", document.getElementById("nameVisible-nr").value);
                                sessionStorage.setItem("reg-lastname", document.getElementById("lastnameVisible-nr").value);
                                sessionStorage.setItem("reg-email", document.getElementById("emailVisible-nr").value);
                                sessionStorage.setItem("reg-rfc", document.getElementById("rfcVisible-nr").value);
                            }
                            var id = result.idUsuario;
                            sessionStorage.setItem("id", id);
                            data2 = {
                                email: data.email,
                                idUsuario: id,
                                url: window.location.origin,
                            }
                            let datajson2 = JSON.stringify(data2);
                            $.ajax({
                                type: 'POST',
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + token,
                                },
                                url: window.config.urlbase + "/Put-mail",
                                complete: hideLoader,
                                data: datajson2,
                                complete: hideLoader,
                                success: function (result) {
                                    result = JSON.parse(result);
                                    if (result == "true")
                                        window.location.href = "/tfsm/home-delivery?ok=1"
                                },
                                error: function (err) {
                                    console.log("No se pudo enviar el mail")
                                }
                            });
                        } else                             
                            window.location.href = "/tfsm/home-delivery?err=" + result.code;
                    },
                    error: function (err) {
                        console.log('Error en la conexion con SalesForce');
                        window.location.href = "/tfsm/home-delivery";
                    }
                });
    }


    /*function registro(data, url, cliente) {
        let datajson = JSON.stringify(data);
        console.log(data);
        $.ajax({
            type: 'GET',
            beforeSend: showLoader,
            url: window.config.urlbase + '/GetAccessToken',
            success: function (result) {
                token = result.result;
                sessionStorage.setItem("token", token);
            },
            complete: function () {
                $.ajax({
                    type: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token,
                    },
                    url: url,
                    data: datajson,
                    success: function (result) {
                        if (result.code == 200) {
                            console.log(result);
                            if (cliente == 1) {
                                sessionStorage.setItem("reg-client", true);
                                sessionStorage.setItem("reg-clientId", document.getElementById("clientVisible-r").value);
                                sessionStorage.setItem("reg-email", document.getElementById("emailVisible-r").value);
                                sessionStorage.setItem("reg-rfc", document.getElementById("rfcVisible-r").value);
                            }
                            else {
                                sessionStorage.setItem("reg-client", false);
                                sessionStorage.setItem("reg-name", document.getElementById("nameVisible-nr").value);
                                sessionStorage.setItem("reg-lastname", document.getElementById("lastnameVisible-nr").value);
                                sessionStorage.setItem("reg-email", document.getElementById("emailVisible-nr").value);
                                sessionStorage.setItem("reg-rfc", document.getElementById("rfcVisible-nr").value);
                            }
                            var id = result.idUsuario;
                            sessionStorage.setItem("id", id);
                            data2 = {
                                email: data.email,
                                idUsuario: id,
                                url: window.location.origin,
                            }
                            let datajson2 = JSON.stringify(data2);
                            $.ajax({
                                type: 'PUT',
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + token,
                                },
                                url: window.config.urlToyotaCotizaciones + "/services/apexrest/SitefinityRegisterClientWS",
                                data: datajson2,
                                complete: hideLoader,
                                success: function (result) {
                                    if (result == "true")
                                        window.location.href = "/tfsm/home-delivery?ok=1"
                                },
                                error: function (err) {
                                    console.log("No se pudo enviar el mail")
                                }
                            });
                        } else
                            window.location.href = "/tfsm/home-delivery?err=" + result.code;
                    },
                    error: function (err) {
                        console.log('Error en la conexion con SalesForce');
                        window.location.href = "/tfsm/home-delivery";
                    }
                });
            },
            error: function (err) {
                console.log('Error token invalido');
            }
        });
    }*/


});

