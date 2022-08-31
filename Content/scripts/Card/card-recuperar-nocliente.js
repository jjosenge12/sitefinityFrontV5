$(document).ready(function () {

    var swiper;

    if (window.location.search.includes("err")) {
        const urlParams = new URLSearchParams(window.location.search);
        var error = urlParams.get("err");

        switch (error) {
            case '1':
                $("#err").html(`Email o RFC incorrectos`);
                $("#err").show();
                break;

        }

    }

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

    function encrypt_reg(isClient) {

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
        //alert(pass_enc);
    }

    $(".link-aviso-privacidad").click(function () {
        window.open(
            window.location.origin + "/legales/aviso-de-privacidad",
            "_blank"
        );
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

    $("#enviar").click(function () {

        let data = {
            rfcVisible: document.getElementById("rfcVisible").value,
            email: document.getElementById("emailVisible").value,
            url: window.location.origin
        }

        var headers = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        };
        let datajson = JSON.stringify(data);
        $.ajax({
            url: window.config.urlbase + '/UpdatePassword',
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
});