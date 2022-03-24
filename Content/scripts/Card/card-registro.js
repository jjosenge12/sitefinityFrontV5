var token = "";

$(document).ready(function () {

    $.ajax(window.config.urlbase + "/GetAccessToken", {
        beforeSend: showLoader,
        complete: hideLoader,
        success: function (data) {
            token = data.result;
        }
    });
  
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

    $("#registro-nc-form").submit(function (e) {
        if ($("#registro-nc-form").valid()) {
            if ($("#registro-terms-nc").prop("checked")) {
                encrypt_reg(false);

                sessionStorage.setItem("reg-client", false);
                sessionStorage.setItem("reg-name", document.getElementById("nameVisible-nr").value);
                sessionStorage.setItem("reg-lastname", document.getElementById("lastnameVisible-nr").value);
                sessionStorage.setItem("reg-email", document.getElementById("emailVisible-nr").value);
                sessionStorage.setItem("reg-rfc", document.getElementById("rfcVisible-nr").value);
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

    $("#registro-c-form").submit(function (e) {
        if ($("#registro-c-form").valid()) {
            if ($("#registro-terms-c").prop("checked")) {
                encrypt_reg(true);

                sessionStorage.setItem("reg-client", true);
                sessionStorage.setItem("reg-clientId", document.getElementById("clientVisible-r").value);
                sessionStorage.setItem("reg-email", document.getElementById("emailVisible-r").value);
                sessionStorage.setItem("reg-rfc", document.getElementById("rfcVisible-r").value);
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
        submitHandler: function (form) {
            document.getElementById("clientVisible-r").removeAttribute("name");
            document.getElementById("rfcVisible-r").removeAttribute("name");
            document.getElementById("emailVisible-r").removeAttribute("name");

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

    $("#reenviar").click(function () {
        let data = {
            rfc: sessionStorage.getItem("reg-rfc"),
            email: sessionStorage.getItem("reg-email")
        }

        var headers = {
            "Authorization": "Bearer " + token,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        };

        $.ajax(window.config.UrlMySalesforce + '/services/apexrest/SetPasswordSitefinity', {
            beforeSend: showLoader,
            complete: hideLoader,
            method: 'put',
            headers: headers,
            data: JSON.stringify(data),
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

    $("#registro-nc-form").validate({
        submitHandler: function (form) {
            document.getElementById("nameVisible-nr").removeAttribute("name");
            document.getElementById("lastnameVisible-nr").removeAttribute("name");
            document.getElementById("emailVisible-nr").removeAttribute("name");
            document.getElementById("rfcVisible-nr").removeAttribute("name");

            $(form).ajaxSubmit();
        },
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


});

