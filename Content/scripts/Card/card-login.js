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

    $("#nc-form").submit(function (e) {
        var pass = document.getElementById("passVisible").value;
        var user = document.getElementById("userVisible").value;
        var fail = document.getElementById("fail").value;
        var ok = document.getElementById("ok").value;
        var pass_enc = window.btoa(pass);
        var user_enc = window.btoa(user);
        var fail_enc = window.btoa(fail);
        var ok_enc = window.btoa(ok);
        document.getElementById("pass").value = pass_enc;
        document.getElementById("user").value = user_enc;
        document.getElementById("fail").value = fail_enc;
        document.getElementById("ok").value = ok_enc;
    });

    $("#c-form").submit(function (e) {
        var pass = document.getElementById("passClientVisible").value;
        var user = document.getElementById("clientVisible").value;
        var fail = document.getElementById("failClient").value;
        var ok = document.getElementById("okClient").value;
        var pass_enc = window.btoa(pass);
        var user_enc = window.btoa(user);
        var fail_enc = window.btoa(fail);
        var ok_enc = window.btoa(ok);
        document.getElementById("passClient").value = pass_enc;
        document.getElementById("client").value = user_enc;
        document.getElementById("failClient").value = fail_enc;
        document.getElementById("okClient").value = ok_enc;

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

    function encrypt(name) {
        var pass = document.getElementById("passVisible").value;
        var user = document.getElementById(`${name}Visible`).value;
        var fail = document.getElementById("fail").value;
        var ok = document.getElementById("ok").value;
        var pass_enc = window.btoa(pass);
        var user_enc = window.btoa(user);
        var fail_enc = window.btoa(fail);
        var ok_enc = window.btoa(ok);
        document.getElementById("pass").value = pass_enc;
        document.getElementById(name).value = user_enc;
        document.getElementById("fail").value = fail_enc;
        document.getElementById("ok").value = ok_enc;
        //alert(pass_enc);
    }

    const swiper = new Swiper('.swiper-container', {
        speed: 400,
        allowTouchMove: false,
        //initialSlide: 1
    });

    $("#ingreso-no-clientes").click(() => swiper.slideNext());
    $("#ingreso-clientes").click(() => swiper.slideTo(0));
    $("#volver-c").click(() => swiper.slideTo(1));
    $("#volver-nc").click(() => swiper.slideTo(0));

    $(".link-aviso-privacidad").click(function () {
        window.open(
            window.location.origin + "/legales/aviso-de-privacidad",
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
                required: true
            },
            _lastname: {
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

    $("#c-form").validate({
        submitHandler: function (form) {
            document.getElementById("passClientVisible").removeAttribute("name");
            document.getElementById("clientVisible").removeAttribute("name");

            $(form).ajaxSubmit();
        },
        rules: {
            _clientId: {
                required: true
            },
            _password: {
                required: true
            }
        }
    });

    $("#nc-form").validate({
        submitHandler: function (form) {
            document.getElementById("passVisible").removeAttribute("name");
            document.getElementById("userVisible").removeAttribute("name");

            $(form).ajaxSubmit();
        },
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

    $("#recuperar-form").validate({
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

    $("#registro-nc-form").submit(function (e) {
        if ($("#registro-nc-form").valid()) {
            if ($("#registro-terms").prop("checked")) {
                encrypt_reg(false);
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

    $("#recuperar-form").submit(function (e) {
        encrypt_reg(true);
    });

    $("#terms-btn").click(function () {
        termsCheckbox = "#registro-terms";
        openModal("newsletterTermsModal");
    });
});