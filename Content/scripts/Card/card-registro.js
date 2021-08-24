$(document).ready(function () {
    $(".sf-form-container").each(function () {
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
        openModal("newsletterTermsModal");
    });

    $("#registro-terms").click(function () {
        console.log("entre");
        termsCheckbox = "#registro-terms";
        openModal("newsletterTermsModal");
    });

    $("#registro-nc-form").submit(function (e) {
        if ($("#registro-nc-form").valid()) {
            if ($("#registro-terms").prop("checked")) {
                encrypt_reg(false);

                sessionStorage.setItem("reg-client", false);
                sessionStorage.setItem("reg-name", document.getElementById("nameVisible").value);
                sessionStorage.setItem("reg-lastname", document.getElementById("lastnameVisible").value);
                sessionStorage.setItem("reg-email", document.getElementById("emailVisible").value);
                sessionStorage.setItem("reg-rfc", document.getElementById("rfcVisible").value);
            }
            else {
                e.preventDefault();
                termsCheckbox = "#registro-terms";
                openModal("newsletterTermsModal");
            }
        }
        else {
            e.preventDefault();
        }
    });

    $("#registro-c-form").submit(function (e) {
        if ($("#registro-c-form").valid()) {
            if ($("#registro-terms").prop("checked")) {
                encrypt_reg(true);

                sessionStorage.setItem("reg-client", true);
                sessionStorage.setItem("reg-clientId", document.getElementById("clientVisible").value);
                sessionStorage.setItem("reg-email", document.getElementById("emailVisible").value);
                sessionStorage.setItem("reg-rfc", document.getElementById("rfcVisible").value);
            }
            else {
                e.preventDefault();
                termsCheckbox = "#registro-terms";
                openModal("newsletterTermsModal");
            }
        }
        else {
            e.preventDefault();
        }
    });

    if (window.location.search.includes("err")) {
        const urlParams = new URLSearchParams(window.location.search);
        var error = urlParams.get("err");

        switch (error) {
            case '6':
                $("#err").html(`Estás registrado como uno de nuestros clientes, por lo que te pedimos hacer clic <a href="${window.location.origin + "/tfsm/home-delivery"}" class="black-link">aquí</a> para ingresar.
                En este acceso deberás registrarte con el usuario y contraseña con los que actualmente ingresas
                a nuestro portal MyTFS`);
                $("#err").show();
                break;
            case '7':
                $("#err").html(`Este usuario ya se encuentra registrado, te pedimos hacer clic <a href="${window.location.origin + "/tfsm/home-delivery"}" class="black-link">aquí</a> para ingresar.
                Para ingresar deberás registrarte con el usuario y contraseña ingresados anteriormente.`);
                $("#err").show();
                break;
            

        }

    }


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

    $("#registro-c-form").validate({
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

    $("#registro-nc-form").validate({
        submitHandler: function (form) {
            document.getElementById("nameVisible").removeAttribute("name");
            document.getElementById("lastnameVisible").removeAttribute("name");
            document.getElementById("emailVisible").removeAttribute("name");
            document.getElementById("rfcVisible").removeAttribute("name");

            $(form).ajaxSubmit();
        },
        rules: {
            _name: {
                required: true,
                isValidName: true,
                minlength: 3
            },
            _lastname: {
                required: true,
                isValidName: true,
                minlength: 3
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

