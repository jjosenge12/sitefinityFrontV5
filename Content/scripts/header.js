var deviceWidth = () =>
    window.innerWidth > 0 ? window.innerWidth : screen.width;

var recaptchaToken = '';

function capitalize(str) {
    return str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
}

function capitalize2(str) {

    const listaPalabras = str.toLowerCase().split(' ');

    for (var i = 0; i < listaPalabras.length; i++) {
        listaPalabras[i] = listaPalabras[i].charAt(0).toUpperCase() + listaPalabras[i].slice(1);
    }

    const cadena = listaPalabras.join(' ');

    return cadena;

}

grecaptcha.ready(function () {
    // do request for recaptcha token
    // response is promise with passed token
    grecaptcha.execute(window.config.reCaptchaSiteKey, { action: 'validate_captcha' })
        .then(function (token) {
            // add token value to form
            recaptchaToken = token;
            console.log(token);
        });
});

$(document).ready(function () {
    $("a.url-mytfsm").attr("href", window.config.urlMyTfsm);
    let isLogged = sessionStorage.getItem("isLogged"), reg = sessionStorage.getItem("reg-rfc");
    $("#logout").hide();
    /*$("#my-tfsm-menu").hide();
    $("#link-finan-menu").hide();
    $("#ir-cotizador").hide();*/

    let username = sessionStorage.getItem("name"), isClient = sessionStorage.getItem("isClient");
    $(".user-name").html(username || "Usuario");

    if (isLogged == "true") {
        $("#link-finan").text("Mis Cotizaciones");
        $("#openMenuBtn").hide()
        $("#openMenuBtn2").show()
        $("#logout").show();
        if ((window.location.href.includes("/tfsm/home-delivery")) && !(window.location.href.includes("solicitud-digital")))
            window.location.replace(window.location.origin);
    } else {
    //if (sessionStorage.length == 0 || isLogged == "false" || reg) {
        $("#link-finan").text("FINANCIAMIENTO EN LÍNEA");
    }

    $("#logout").click(function () {
        sessionStorage.clear();
        window.location.replace(window.location.origin + "/tfsm/home-delivery");
    });


    jQuery.extend(jQuery.validator.messages, {
        required: "Este campo es obligatorio",
        email: "Ingrese un valor de email válido",
        number: "Ingrese un número válido",
        maxlength: jQuery.validator.format("Máximo {0} caracteres"),
        minlength: jQuery.validator.format("Mínimo {0} caracteres"),
    });

    jQuery.validator.addMethod(
        "isEmail",
        function (value, element) {
            // let email =
            //   /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

            let email = /^[a-zA-Z][a-zA-Z0-9\-\_\.]+@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+$/;
            let regex = new RegExp(email);

            return regex.test(value);
        },
        "Ingrese un valor de email válido"
    );

    jQuery.validator.addMethod(
        "selectRequired",
        function (value, element) {
            return (
                [0, "0", "-1", "", "null", "undefined"].indexOf(String(value)) === -1
            );
        },
        "Este campo es obligatorio"
    );

    jQuery.validator.addMethod(
        "isPostalCode",
        function (value, element) {
            let regex = new RegExp(/^\d{4,5}$/);
            return regex.test(value);
        },
        "Ingrese un código postal válido"
    );

    jQuery.validator.addMethod(
        "isValidName",
        function (value, element) {
            let regex = new RegExp(
                /^([a-zA-ZÀ-ÿ\u00f1\u00d1]+\.?\s)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+\.?$/
            );
            return regex.test(value);
        },
        "Formato inválido"
    );

    jQuery.validator.addMethod(
        "confirmPassword",
        function (value, element, params) {
            return value === $(`#${params}`).val();
        },
        "Las contraseñas no coinciden"
    );

    $("#link-finan").click(function (e) {
        let session = sessionStorage.getItem("isLogged");
        if (session === "true") {
            e.preventDefault();
            window.location.replace(
                window.location.origin + "/tfsm/mis-cotizaciones"
            );
        }
    });

    $("#link-finan-menu").click(function (e) {
        let session = sessionStorage.getItem("isLogged");
        if (session === "true") {
            e.preventDefault();
            window.location.replace(
                window.location.origin + "/tfsm/mis-cotizaciones"
            );
        }
    });

    $(".toggleMenu").click(() => {
        let overlay = $("#menuOverlay").css("display");
        document.body.style.overflow = "hidden";
        if (isLogged == "true" ) {
            $.when(
                $("#closeMenuBtn2").toggle(),
                $("#openMenuBtn2").toggle(),
                $("#menuOverlay").fadeToggle(100),
                $("#drawerMenu").toggle("slide", { direction: "right" })
            ).then(() => {
                if (overlay === "flex") {
                    document.body.style.overflow = "auto";
                    $(".deployItems").each(function () {
                        $(`#${this.id}Arrow`).removeClass("pointDown");
                        $(`#${this.id}Arrow`).addClass("pointRight");
                        $(`#${this.id}Items`).slideUp();
                    });
                }
            });
            
        } else {
            $.when(
                $("#openMenuBtn").toggle(),
                $("#closeMenuBtn").toggle(),
                $("#menuOverlay").fadeToggle(100),
                $("#drawerMenu").toggle("slide", { direction: "right" })
            ).then(() => {
                if (overlay === "flex") {
                    document.body.style.overflow = "auto";
                    $(".deployItems").each(function () {
                        $(`#${this.id}Arrow`).removeClass("pointDown");
                        $(`#${this.id}Arrow`).addClass("pointRight");
                        $(`#${this.id}Items`).slideUp();
                    });
                }
            });
        }
    });

    $(".deployItems").click(function () {
        let div = $(this)[0];
        console.log($(`#${div.id}`).siblings("div[class='deployItems']"));
        $(`#${div.id}Arrow`).toggleClass("pointRight pointDown");
        $(`#${div.id}Items`).slideToggle();

        $(`#${div.id}`)
            .siblings("div[class='deployItems']")
            .each(function () {
                $(`#${this.id}Arrow`).removeClass("pointDown");
                $(`#${this.id}Arrow`).addClass("pointRight");
                $(`#${this.id}Items`).slideUp();
            });
    });

    $("#expandPlanes").click(function () {
        $("#planesArrow").toggleClass("pointRight pointDown");
        $("#listPlanes").slideToggle();
    });

    $("#expandArrendamientos").click(function () {
        $("#arrendamientosArrow").toggleClass("pointRight pointDown");
        $("#listArrendamientos").slideToggle();
    });

    $("#expandLegales").click(function () {
        $("#legalesArrow").toggleClass("pointRight pointDown");
        $("#listLegales").slideToggle();
    });

    $(".sf-form-container").each(function () {
        var form = document.createElement("form");

        form.innerHTML = this.innerHTML;
        Object.keys(this.dataset).forEach((x) => {
            form[x] = this.dataset[x];
        });

        $(this).html(form);
    });

    // He leído y acepto el aviso de privacidad y los términos y condiciones de uso de la página
    $("#newsletterAviso").click(function () {
        window.open(
            window.location.origin + "/legales/aviso-de-privacidad",
            "_blank"
        );
    });

    $("#newsletterTerms").click(() => {
        termsCheckbox = "#termsCheckbox";
        //openModal("newsletterTermsModal"); //quito el modal y reemplazo para que se abra una Page
        window.open(
            window.location.origin + "/terminos-de-servicio", // se redirige a la nueva page de Term
            "_blank"
        );
    });

    // Planes - tambien se quitara el modal
    $("#plansTerms").click(() => {
        termsCheckbox = "#plansTermsCheckbox";
        //openModal("newsletterTermsModal");
        window.open(
            window.location.origin + "/terminos-de-servicio", // se redirige a la nueva page de Term
            "_blank"
        );
    });

    $("#termsCheckbox").click(function (e) {
        if ($("#termsCheckbox").prop("checked")) {
            e.preventDefault();
            termsCheckbox = "#termsCheckbox";
            openModal("newsletterTermsModal");
        }
    });

    $("#plansTermsCheckbox").click(function (e) {
        if ($("#plansTermsCheckbox").prop("checked")) {
            e.preventDefault();
            termsCheckbox = "#plansTermsCheckbox";
            openModal("newsletterTermsModal");
        }
    });

    $("#closeNewsletterTerms").click(() => closeModal("newsletterTermsModal"));

    $("#modalOverlay").click(function () {
        $(".modal-custom").each(function () {
            let parent = $(this).parent()[0];
            // console.log(this.parent);
            if ($(parent).css("display") !== "none") {
                closeModal(parent.id);
            }
        });
    });

    $("#denyNewsletterTerms").click(function () {
        console.log(termsCheckbox);
        $(termsCheckbox).prop("checked", false);
        closeModal("newsletterTermsModal");
    });

    $("#acceptNewsletterTerms").click(function () {
        console.log(termsCheckbox);
        $(termsCheckbox).prop("checked", true);
        closeModal("newsletterTermsModal");
    });

    $(".social-network").click(function () {
        openModal(`${this.id}Modal`);
    });

    $("[id$='ModalClose']").click(function () {
        closeModal(`${this.dataset.modal}Modal`);
    });

    $("[id$='ModalBack']").click(function () {
        closeModal(`${this.dataset.modal}Modal`);
    });

    $("[id$='ModalContinue']").click(function () {
        closeModal(`${this.dataset.modal}Modal`);
        switch (this.dataset.modal) {
            case "instagram":
                window.open(
                    "https://www.instagram.com/toyotafinancialservicesmexico/",
                    "_blank"
                );
                break;
            case "facebook":
                window.open("https://www.facebook.com/TFSMexico/", "_blank");
                break;
            case "linkedin":
                window.open("https://www.linkedin.com/company/tfsm/", "_blank");
                break;
            case "youtube":
                window.open(
                    "https://www.youtube.com/c/ToyotaFinancialServicesMexico/",
                    "_blank"
                );
                break;
        }
    });

    var nl_validator = $("#newsletter-form").validate({
        rules: {
            "nl-email": {
                required: true,
                isEmail: true,
            },
        },
    });

    $("#newsletter-form").submit(function (e) {
        e.preventDefault();
        if ($(this).valid()) {            
            if (!$("#termsCheckbox").prop("checked")) {
                termsCheckbox = "#termsCheckbox";
                openModal("newsletterTermsModal");
                //Swal.fire({ type: 'error', title: 'Aceptar términos y condiciones', text: 'Por favor acepte los términos y condiciones de uso de la página para continuar' });
            } else {
                commitNewsletter($("#nl-email").val());
            }
        }
    });

    $("#submit-newsletter").click(function () {
        $("#newsletter-form").submit();
    });

    $(".link-aviso-privacidad").click(function () {
        window.open(
            window.location.origin + "/legales/aviso-de-privacidad",
            "_blank"
        );
    });
});

function showLoader() {
    $("#loader-overlay").show();
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
}

function hideLoader() {
    $("#loader-overlay").hide();
    document.getElementsByTagName("body")[0].style.overflow = "initial";
}

function openModal(modalId) {
    const modal = $(`#${modalId}`);
    document.body.style.overflow = "hidden";
    $("#modalOverlay").show("fade");
    console.log(modal);
    if (modal.id === "newsletterTermsModal" || modal.id === "avisoPrivClientesModal") {
        let body = modal.querySelector(".modal-body-custom");
        $(body).animate({ scrollTop: $(body).offset().top - 20 }, "fast");
    }

    $(document).keydown(function (objEvent) {
        if (objEvent.keyCode == 9) {
            objEvent.preventDefault();
        }
    });

    $(document).keydown(function (objEvent) {
        if (objEvent.keyCode == 13) {
            objEvent.preventDefault();
            $("#acceptNewsletterTerms").click();
            $("#acceptAvisoPriv").click();
            closeModal(modalId);
        }
    });

    if (deviceWidth() <= 767) {
        modal.show("slide", { direction: "down" });
    } else {
        modal.animate(
            {
                display: "toggle",
                opacity: 1,
                top: "-=50",
            },
            400,
            () => modal.css({ display: "block" })
        );
    }
}

function closeModal(modalId) {
    const modal = $(`#${modalId}`);
    $("#modalOverlay").hide("fade");

    if (deviceWidth() <= 767) {
        modal.hide("slide", { direction: "down" });
    } else {
        modal.animate(
            {
                opacity: 0,
                display: "toggle",
                top: "+=50",
            },
            400,
            () => {
                modal.css({ display: "none" });
            }
        );
    }
    $(document).unbind('keydown');
    document.body.style.overflow = "auto";
}

function getDealersByState(select) {
    let _dealers = [];
    $.ajax({
        type: "get",
        url: window.config.urlbase + "/getdealersbystate",
        datatype: "json",
        success: function (data) {
            data.results.forEach((s) => {
                var state = {
                    text: s.Descripcion,
                    children: [],
                };

                s.Distribuidores.forEach((d, idx) => {
                    state.children.push({
                        id: d.IdDealer,
                        text: capitalize2(d.Dealer),
                        codigo: d.Code,
                    });
                });

                _dealers.push(state);
            });

            $(`#${select}`).select2({
                dropdownParent: $(`#${select}`).parent(),
                data: _dealers,
            });
        },
    });
}

function commitNewsletter(email) {
    $.ajax({
        url: window.config.urlbase + "/SalesforceNewsletter",
        method: "POST",
        beforeSend: showLoader,
        complete: function () {
            $("#nl-email").val("");
            $("#termsCheckbox").prop("checked", false);
            hideLoader();
            grecaptcha.execute(window.config.reCaptchaSiteKey, { action: 'validate_captcha' })
                .then(function (token) {
                    // add token value to form
                    recaptchaToken = token;
                });
        },
        data: { Email: email, AceptoTerminosYCondiciones: "Si Acepto", recaptchaToken },
        success: function () {
            Toastnotify.create({
                text: "Gracias por registrarte! Serás notificado cuando tengamos cosas nuevas.",
                duration: 5000,
            });
        },
        error: function (err) {
            console.log(err);
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al enviar información, intenta mas tarde.",
                icon: "error",
                confirmButtonColor: "#cc0000",
                timer: 5000,
            });
        },
    });
}

function validateCaptcha() {
    grecaptcha.ready(function () {
        grecaptcha
            .execute(window.config.reCaptchaSiteKey, { action: "submit" })
            .then(function (token) {
                // Add your logic to submit to your backend server here.
            });
    });
}
