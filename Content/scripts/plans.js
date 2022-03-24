const api_url = "https://tfs-sitefinity.virtualdreams.io:444/api/tfsm/";

$(document).ready(function () {
    const FloatLabel = (() => {
        // add active class
        const handleFocus = (e) => {
            const target = e.target;
            target.parentNode.classList.add("active");
            target.parentNode.classList.add("focus");

            var placeholder = target.getAttribute("data-placeholder");
            if (placeholder) {
                target.setAttribute("placeholder", placeholder);
            }
        };

        // remove active class
        const handleBlur = (e) => {
            const target = e.target;
            if (!target.value) {
                target.parentNode.classList.remove("active");
            }
            target.parentNode.classList.remove("focus");
            target.removeAttribute("placeholder");
        };

        // register events
        const bindEvents = (floatField) => {
            // const floatField = element.querySelector("input");
            floatField.addEventListener("focus", handleFocus);
            floatField.addEventListener("blur", handleBlur);
        };

        // get DOM elements
        const init = () => {
            const floatContainers = document.querySelectorAll(".float-container");

            floatContainers.forEach((element) => {
                let input = element.querySelector("input");
                let select = element.querySelector("select");

                if (input) {
                    if (input.value) {
                        element.classList.add("active");
                    }

                    bindEvents(input);
                }

                if (select) {
                    if (select.value) {
                        element.classList.add("active");
                    }
                    bindEvents(select);
                }
            });
        };

        return {
            init: init,
        };
    })();

    FloatLabel.init();

    function openModal(modalId) {
        const modal = $(`#${modalId}`);
        document.body.style.overflow = "hidden";
        $("#modalOverlay").show("fade");

        if (modal.id === "newsletterTermsModal") {
            let body = modal.querySelector(".modal-body-custom");
            $(body).animate({ scrollTop: $(body).offset().top - 20 }, "fast");
        }

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

    jQuery.extend(jQuery.validator.messages, {
        required: "Este campo es obligatorio.",
        email: "Ingrese un valor de email válido.",
        number: "Ingrese un número válido.",
        maxlength: jQuery.validator.format("Máximo {0} caracteres."),
        minlength: jQuery.validator.format("Mínimo {0} caracteres."),
    });

    $.validator.addMethod(
        "valueNotEquals",
        function (value, element, arg) {
            console.log("value not equals: " + String(arg) + "  -  " + String(value));
            return String(arg) !== String(value);
        },
        "Value must not equal arg."
    );

    function submitLead() {
        var form = {
            Plan: $("#planType").val(),
            Firstname: $("#name").val(),
            Lastname: $("#lastname").val(),
            Email: $("#email").val(),
            DealerId: $("#distributor").val(),
            Dealer: $("#distributor option:selected").html(),
            Vehicle: $("#vehicle option:selected").html(),
            Phone: $("#phone").val(),
        };

        $.ajax({
            type: "post",
            url: window.config.urlbase + "/submit-lead",
            processData: false,
            contentType: "application/json",
            datatype: "json",
            beforeSend: showLoader,
            complete: hideLoader,
            data: JSON.stringify(form),
            success: function (data) {
                $("#distributor").val("0");
                $("#distributor").trigger("change");
                $("#vehicle").val("0");
                $("#vehicle").trigger("change");
                $("#plansTermsCheckbox").prop("checked", false);

                $(".float-container input").each(function () {
                    $(this).val("");
                    this.parentNode.classList.remove("active");
                    this.parentNode.classList.remove("focus");
                    this.removeAttribute("placeholder");
                });

                Toastnotify.create({
                    text: "Gracias por registrarte, en breve uno de nuestros Asesores Digitales Toyota te contactará.",
                    duration: 5000,
                });

                $.ajax(window.location.origin + "/plan-submitted");
            },
            failure: function (err) {
                alert("Error al crear el Lead :(");
                console.log(err);
            },
        });
    }

    var plan_validator;

    function initSelects() {
        getDealers();
        getCars();
    }

    $(".video-box").click(function () {
        $(".video-box img").addClass("d-none");
        $(".video-box figure").removeClass("d-none");
        $(".video-box video")[0].play();
    });

    function getDealers() {
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

                    s.Distribuidores.forEach((d) => {
                        state.children.push({
                            id: d.IdDealer,
                            text: capitalize2(d.Dealer),
                            dealerCode: d.Code,
                        });
                    });

                    _dealers.push(state);
                });

                $("#distributor").select2({
                    dropdownParent: $("#distributor").parent(),
                    data: _dealers,
                });
            },
        });
    }

    function getCars() {
        let _cars = [];
        $.ajax({
            type: "get",
            url: window.location.origin + "/api/default/autos",
            datatype: "json",
            success: function (data) {
                var _data = data.value.filter(
                    (value, index) =>
                        data.value.findIndex((x) => x.Title === value.Title) === index
                );

                _data.forEach((x) => {
                    let car = {
                        id: x.AutoId,
                        text: capitalize(x.Title),
                    };

                    _cars.push(car);
                });

                $("#vehicle").select2({
                    dropdownParent: $("#vehicle").parent(),
                    data: _cars,
                });
            },
        });
    }

    $.when(initSelects()).then(() => {
        FloatLabel.init();

        $("#distributor").on("select2:open", function () {
            $("#distributor").siblings("[class='focus-border']").addClass("active");
        });
        $("#vehicle").on("select2:open", function () {
            $("#vehicle").siblings("[class='focus-border']").addClass("active");
        });

        $("#distributor").on("select2:close", function () {
            $("#distributor")
                .siblings("[class='focus-border active']")
                .removeClass("active");
        });
        $("#vehicle").on("select2:close", function () {
            $("#vehicle")
                .siblings("[class='focus-border active']")
                .removeClass("active");
        });

        $("#distributor").on("select2:select", function () {
            $("#distributor").valid();
        });
        $("#vehicle").on("select2:select", function (e) {
            $("#vehicle").valid();
        });

        plan_validator = $("#plan-form").validate({
            rules: {
                name: {
                    required: true,
                    isValidName: true,
                    minlength: 2
                },
                lastname: {
                    required: true,
                    isValidName: true,
                    minlength: 2
                },
                email: {
                    required: true,
                    isEmail: true,
                },
                phone: {
                    required: true,
                    minlength: 10,
                    maxlength: 10
                },
                vehicle: {
                    selectRequired: true,
                },
                distributor: {
                    selectRequired: true,
                },
            },
        });

        $("#plan-form").submit(function (e) {
            e.preventDefault();
            if ($("#plan-form").valid()) {
                if ($("#plansTermsCheckbox").prop("checked")) {
                    commitSalesforcePlan();
                } else {
                    termsCheckbox = "#plansTermsCheckbox";
                    openModal("newsletterTermsModal");
                }
            } else {
                console.log("formulario inválido");
            }
        });
    });

    $("#submit-plan").click(function () {
        $("#plan-form").submit();
    });
});

function planSubmitClick() {
    $("#plan-form").submit();
}

function commitSalesforcePlan() {
    var data = {
        Plan: $("#planType").val(),
        Movil: $("#phone").val(),
        Email: $("#email").val(),
        Nombre: $("#name").val(),
        Apellido: $("#lastname").val(),
        AceptoTerminosYCondiciones: "SiAcepto",
        Marca: $("#vehicle option:selected").html(),
        Ballon: "text_ballon",
        Aseguradora: $("#distributor option:selected").html(),
        CodigoDistribuidor: $("#distributor").select2("data")[0].dealerCode,
        recaptchaToken
    };

    $.ajax({
        type: "POST",
        url: window.config.urlbase + "/SalesForceCommitPlan",
        data: data,
        dataType: "json",
        success: function (result) {
            console.log(result);

            $("#phone").val("");
            $("#email").val("");
            $("#name").val("");
            $("#lastname").val("");
            $("#distributor").val("0");
            $("#distributor").trigger("change");
            $("#vehicle").val("0");
            $("#vehicle").trigger("change");
            $("#plansTermsCheckbox").prop("checked", false);

            Toastnotify.create({
                text: "Gracias por registrarte, en breve uno de nuestros Asesores Digitales Toyota te contactará.",
                duration: 10000,
            });

            $.ajax(window.location.origin + "/plan-submitted");
        },
        error: function (err) {
            console.log(err);
            Swal.fire({
                title: "Error",
                text: "Error al enviar información a Salesforce",
                icon: "error",
                confirmButtonColor: "#cc0000",
                timer: 5000,
            });
        },
        complete: function () {
            grecaptcha.execute(window.config.reCaptchaSiteKey, { action: 'validate_captcha' })
                .then(function (token) {
                    // add token value to form
                    recaptchaToken = token;
                });
        }
    });
}
