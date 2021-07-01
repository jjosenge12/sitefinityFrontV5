var form = {}, swiper, cars_swiper, cotizacion;

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

function scrollToTargetAdjusted(element) {
    //var element = document.getElementById(elementId);
    var headerOffset = 0;
    //var elementPosition = element.getBoundingClientRect().top;
    var elementPosition = element.offsetTop;
    var offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}

function formNextStep(step) {
    let next = $(`.step-4-${step}`)[0];
    console.log(next);
    console.log(`.step-4-${step}`);
    if (next !== null && next !== undefined) {
        $.when(
            $(`.step-4-${step}`).removeClass(`step-4-${step}`),
            swiper.updateAutoHeight(0)
        )
            .then(() => scrollToTargetAdjusted(next));
    }
}

$(document).ready(function () {
    jQuery.validator.addMethod(
        "selectRequired",
        function (value, element) {
            return [0, "0", "-1", "", "null", "undefined"].indexOf(String(value)) === -1;
        },
        "Este campo es obligatorio"
    );

    getCountryStates();
    getInsurers();

    swiper = new Swiper('#cotizador-swiper-container', {
        speed: 400,
        allowTouchMove: false,
        autoHeight: true
    });

    $(".select-button").click(function () {
        let container = this.dataset.for;

        $(`#select-${container} .select-button`).removeClass("selected");
        $(this).addClass("selected");
    });

    getDealersByState("step-5-distribuidores");

    //----------------STEP 1----------------

    $("#start").click(() => {
        let session = sessionStorage.getItem("isLogged");
        if (session === "true") {
            let name = sessionStorage.getItem("name"),
                lastname = sessionStorage.getItem("lastname"),
                email = sessionStorage.getItem("email");

            form["Nombre"] = name;
            form["Apellido"] = lastname;
            form["emailCliente"] = email;

            $("#name").val(name);
            $("#lastname").val(lastname);
            $("#email").val(email);
            swiper.slideTo(2, 200);
        }
        else {
            swiper.slideTo(1);
        }
    });

    //----------------STEP 2----------------

    $("#step-2-form").validate({
        rules: {
            name: {
                required: true
            },
            lastname: {
                required: true
            },
            email: {
                required: true,
                isEmail: true
            }
        }
    });

    $("#step-2-terms-btn").click(function () {
        termsCheckbox = "#step-2-terms";
        openModal("newsletterTermsModal");
    });

    $("#step-2-continue").click(() => {
        if ($("#step-2-form").valid()) {
            if ($("#step-2-terms").prop("checked")) {
                swiper.slideNext();
                form["Nombre"] = $("#name").val();
                form["Apellido"] = $("#lastname").val();
                form["emailCliente"] = $("#email").val();

                cars_swiper.autoplay.start();
            } else {
                termsCheckbox = "#step-2-terms";
                openModal("newsletterTermsModal");
            }
        }
    });

    //----------------STEP 3----------------

    cars_swiper = new Swiper('#cars-swiper-container', {
        speed: 400,
        spaceBetween: 30,
        slidesPerColumn: 2,
        slidesPerView: 1,
        autoplay: {
            delay: 3000,
        },
        breakpoints: {
            992: {
                slidesPerColumnFill: 'column',
                slidesPerView: 4,
                slidesPerColumn: 1,
                loop: true,
            }
        },
        navigation: {
            nextEl: '#cars-swiper-next',
            prevEl: '#cars-swiper-prev'
        }
    });
    cars_swiper.autoplay.stop();


    $(".select-car").click(function () {
        $(".car-slide").removeClass("selected");
        $(this).parent().addClass("selected");
        console.log(this.parentNode.dataset.autoId);
        $("#step-3-continue").removeAttr("disabled");
        cars_swiper.autoplay.stop();
    });

    $(".car-slide").click(function () {
        $(".car-slide").removeClass("selected");
        $(this).addClass("selected");
        $("#step-3-continue").removeAttr("disabled");
        cars_swiper.autoplay.stop();
    });

    $("#car-version-form").validate({
        rules: {
            car_version: {
                selectRequired: true
            }
        }
    });

    $("#step-3-back").click(function () {
        swiper.slidePrev();

        $(".car-slide").removeClass("selected");
        cars_swiper.autoplay.start();
    });

    $("#step-3-continue").click(function () {

        if ($(".car-slide.selected").length > 0) {
            let selected = $(".car-slide.selected")[0];
            getCantidadDepositos(selected.dataset.autoId);
            $.when(
                form = {
                    ...form,
                    Marca: selected.dataset.autoName,
                    autoId: selected.dataset.autoId,
                    imagenAuto: selected.dataset.autoPicture
                },
                setAutoValues(selected)
            )
                .then(() => {
                    swiper.slideNext();
                });

            getVersions(selected.dataset.autoId);
        }
        else {
            Swal.fire({
                title: "Seleccione un vehículo",
                icon: "warning",
                confirmButtonColor: "#cc0000"
            });
        }

    });

    //----------------STEP 4----------------

    $("#step-4-back").click(function () {
        $("#cotizador-swiper-container").addClass("limited-height");
        clearValues();
        swiper.slidePrev();
    });

    $("#car_version").change(function (e) {
        form = {
            ...form,
            Vesion: $("#car_version option:selected")[0].dataset.version,
            Anio: $("#car_version option:selected")[0].dataset.anio,
            precioAuto: $(this).val(),
            EngancheDeposito: $(this).val() / 10
        }

        $("#hitch-range").attr("min", form.EngancheDeposito);
        $("#hitch-range").val(form.EngancheDeposito);
        $("#hitch-text").html("$ " + form.EngancheDeposito + " M.N.");

        formNextStep(2);
    });

    $("#select-insurance").change(() => getCoverages());

    $("#select-state").change(() => {
        if ($("#select-state").val() && $("#select-coverage").val()) {
            formNextStep(4);
        }
    });

    $("#select-coverage").change(() => {
        if ($("#select-state").val() && $("#select-coverage").val()) {
            formNextStep(4);
        }
    });

    $("#select-personalidad-fiscal .select-button").click(function () {
        if (this.dataset.value === "Física") {
            //$("#select-financing .select-button")[0].classList.add("selected");
            //$("#select-financing .select-button")[0].click();
            $("#select-financing .select-button")[1].style.display = "none";
            $("#select-arrendamiento .select-button.selected")[0]?.classList.remove("selected");
        }
        else {
            $("#select-financing .select-button")[1].style.display = "flex";
        }

        formNextStep(3);
    });

    $("#select-financing .select-button").click(function () {
        switch (this.dataset.value) {
            case "Financiamiento":
                $(".title-financiamiento").html("financiamiento");
                $(".title-enganche").html("enganche");
                $("#select-plan").show();
                $("#select-arrendamiento").hide();
                $("#data-depositos").hide();
                $("#select-arrendamiento .select-button.selected")[0]?.classList.remove("selected");
                break;
            case "Arrendamiento":
                $(".title-financiamiento").html("arrendamiento");
                $(".title-enganche").html("depósito");
                $("#select-plan").hide();
                $("#select-arrendamiento").show();
                $("#data-depositos").show();
                $("#select-plan .select-button.selected")[0]?.classList.remove("selected");
                break;
        }
        swiper.updateAutoHeight(0);
        formNextStep(5);
    });

    $("#select-plan .select-button").click(function () { formNextStep(7); });
    $("#select-arrendamiento .select-button").click(function () { formNextStep(6); });
    $("#select-term .select-button").click(function () { formNextStep(8); });
    $("#select-cantidad-depositos").change(function () { formNextStep(7); });

    $("#hitch-range").change(function () {
        form.hitch = $("#hitch-range").val();
        $("#hitch-text").html("$ " + Number(form.hitch).toFixed(2) + " M.N.");
    });

    $("#hitch-minus").click(function () {
        let val = $("#hitch-range").val();
        let calc = Number(val) - 5000;
        if (calc >= (form.precioAuto / 10)) {
            $("#hitch-range").val(calc);
            $("#hitch-range").change();
            $("#hitch-text").html("$ " + calc.toFixed(2) + " M.N.");
        }
    });

    $("#hitch-plus").click(function () {
        let val = $("#hitch-range").val();
        let calc = Number(val) + 5000;
        if (calc <= 100000) {
            $("#hitch-range").val(calc);
            $("#hitch-range").change();
            $("#hitch-text").html("$ " + calc.toFixed(2) + " M.N.");
        }
    });

    $("#step-4-finish").click(function () {
        if (validateStepFour()) {
            $.when(getFormValues())
                .then(() => cotizar());

        }
        else {
            Swal.fire({
                title: "Por favor complete todos los datos para continuar",
                icon: "error",
                confirmButtonColor: '#cc0000'
            })
        }
    });

    //----------------STEP 5----------------

    $("#step-5-contact-form").validate({
        rules: {
            distribuidores: {
                selectRequired: true
            },
            phone: {
                required: true
            }
        }
    });

    $("#step-5-distribuidores").on("select2:open", function () {
        $("#step-5-distribuidores").siblings("[class='focus-border']").addClass("active");
    });

    $("#step-5-distribuidores").on("select2:close", function () {
        $("#step-5-distribuidores")
            .siblings("[class='focus-border active']")
            .removeClass("active");
    });

    $("#step-5-distribuidores").on("select2:select", function () {
        $("#step-5-distribuidores").valid();
    });

    $("#step-5-contact-form").submit(function (e) {
        e.preventDefault();
    });

    $("#step-5-contact").click(function () {
        $("#step-5-contact-form").valid();
    });

    $("#step-5-terms-btn").click(function () {
        termsCheckbox = "#step-5-terms";
        openModal("newsletterTermsModal");
    });

    $("#select-otro-plazo .select-button").click(function () {
        $.when(form.Plazo = this.dataset.value)
            .then(() => showResults(cotizacion));
    });

    $("#cotizar-otro").click(function () {
        $.when(clearValues())
            .then(() => swiper.slideTo(2, 0));
    });

    $("#step-5-contact").click(() => {
        if ($("#step-5-contact-form").valid()) {
            if ($("#step-5-terms").prop("checked")) {
                sendDataSalesforce();

            } else {
                termsCheckbox = "#step-5-terms";
                openModal("newsletterTermsModal");
            }
        }
    });
});

function getFormValues() {
    form = {
        Nombre: $("#name").val(),
        Apellido: $("#lastname").val(),
        emailCliente: $("#email").val(),
        Telefono: $("#phone").val(),
        Marca: $(".car-slide.selected")[0].dataset.autoName,
        autoId: $(".car-slide.selected")[0].dataset.autoId,
        imagenAuto: $(".car-slide.selected")[0].dataset.autoPicture,
        Vesion: $("#car_version option:selected")[0].dataset.version,
        Anio: $("#car_version option:selected")[0].dataset.anio,
        Modelo: $("#car_version option:selected")[0].dataset.anio,
        precioAuto: $("#car_version").val(),
        EngancheDeposito: $("#hitch-range").val(),
        TipoPersona: $("#select-personalidad-fiscal .select-button.selected")[0].dataset.value,
        Estado: $("#select-state option:selected")[0].innerHTML,
        Aseguradora: $("#select-insurance option:selected")[0].innerHTML,
        Cobertura: $("#select-coverage option:selected")[0].innerHTML,
        PlanCotizar: $("#select-financing .select-button.selected")[0].dataset.value === "Financiamiento" ? $("#select-plan .select-button.selected")[0].dataset.value : "Arrendamiento " + $("#select-arrendamiento .select-button.selected")[0].dataset.value,
        Plazo: $("#select-term .select-button.selected")[0].dataset.value,
        TipoUso: "Depósitos de Garantía",
        CantidadDepositosGarantia: $("#select-cantidad-depositos").val(),
    }
    console.log(form);
}

function showResults(data) {
    var _data = data.filter(x => x.Plazo == form.Plazo)[0];

    $(".step-5-nombre-cliente").html(_data.Nombre.trim());
    $(".step-5-nombre-auto").html(_data.Marca);
    $(".step-5-version-auto").html(_data.Vesion);
    $(".step-5-anio-auto").html(_data.Anio);
    $(".step-5-tipo-persona").html(_data.TipoPersona);
    $(".step-5-imagen-auto").attr("src", form.imagenAuto);
    $(".step-5-mensualidad").html(`$ ${numberWithCommas(_data.Mensualidad.toFixed(2))} M.N.`);
    $(".step-5-enganche").html(`$ ${numberWithCommas(_data.Enganche.toFixed(2))} M.N.`);
    $(".step-5-deposito").html(`${_data.DepositoGarantia} - $ ${numberWithCommas(_data.Enganche.toFixed(2))} M.N.`);
    $(".step-5-plazo").html(_data.Plazo + " Meses");
    $(".step-5-precio-total").html(`$ ${numberWithCommas(_data.PrecioTotal.toFixed(2))} M.N.`);
    $(".step-5-monto-arrendar").html(`$ ${numberWithCommas(_data.PrecioTotal.toFixed(2))} M.N.`);
    $(".step-5-aseguradora").html(_data.Aseguradora);
    $(".step-5-cobertura").html(_data.Cobertura);
    $(".step-5-cat").html(_data.CAT + "%");
    $(".step-5-tasa-interes").html((_data.PorcentajeComision * 100).toFixed(2) + "%");

    switch (form.Plazo) {
        case "24":
            $("#select-otro-plazo .select-button")[0].classList.add("selected");
            break;
        case "36":
            $("#select-otro-plazo .select-button")[1].classList.add("selected");
            break;
        case "48":
            $("#select-otro-plazo .select-button")[2].classList.add("selected");
            break;
    }

    switch (form.PlanCotizar) {
        case "Tradicional":
            $(".step-5-plan").attr("src", "/Content/images/Planes/plan-tradicional.png");
            $("#data-anualidades").hide();
            $("#data-balloon").hide();
            $(".step-5-datos-plan").show();
            $(".step-5-datos-arrendamiento").hide();
            break;
        case "Balloon":
            $(".step-5-plan").attr("src", "/Content/images/Planes/plan-balloon.png");
            $(".step-5-monto-balloon").html(`$ ${numberWithCommas(_data.Ballon.toFixed(2))} M.N.`);
            $(".step-5-porcentaje-balloon").html((_data.PBallon * 100) + "%");
            $("#data-anualidades").hide();
            $("#data-balloon").show();
            $(".step-5-datos-plan").show();
            $(".step-5-datos-arrendamiento").hide();
            break;
        case "Anualidades":
            $(".step-5-plan").attr("src", "/Content/images/Planes/plan-anualidades.png");
            $(".step-5-anualidad").html(`$ ${numberWithCommas(_data.Anualidad.toFixed(2))} M.N.`);
            $("#data-anualidades").show();
            $("#data-balloon").hide();
            $(".step-5-datos-plan").show();
            $(".step-5-datos-arrendamiento").hide();
            break;
        case "Arrendamiento financiero":
            $(".step-5-plan").attr("src", "/Content/images/Planes/logo_arrendamiento_finan.png");
            $("#data-anualidades").hide();
            $("#data-balloon").hide();
            $(".step-5-datos-plan").hide();
            $(".step-5-datos-arrendamiento").show();
            break;
        case "Arrendamiento puro":
            $(".step-5-plan").attr("src", "/Content/images/Planes/logo_arrendamiento_puro.png");
            $("#data-anualidades").hide();
            $("#data-balloon").hide();
            $(".step-5-datos-plan").hide();
            $(".step-5-datos-arrendamiento").show();
            break;
    }
    swiper.updateAutoHeight(0);

}

function cotizar() {

    $.ajax({
        type: 'POST',
        url: window.config.urlbase + '/PostCotizacion',
        data: form,
        beforeSend: showLoader,
        complete: hideLoader,
        dataType: "json",
        success: function (result) {
            if (parseInt(result.data.Status) == 400) {
                Swal.fire({
                    title: "Error",
                    text: "No existe información para la versión seleccionada",
                    icon: "error",
                    confirmButtonColor: "#cc0000",
                    timer: 5000
                });
                console.log(result.data.Message);
            } else {

                if (result.data.Prices.length > 0) {
                    cotizacion = result.data.Prices;
                    showResults(result.data.Prices);
                    window.scrollTo(0, 0);
                    swiper.slideNext();
                    commitSalesforce();
                    console.log(result.data.Prices);

                } else {
                    Swal.fire({
                        title: "Error",
                        text: "No existe información para la versión seleccionada",
                        icon: "error",
                        confirmButtonColor: "#cc0000",
                        timer: 5000
                    });
                    console.log(result.data.Message);
                }
            }
        },
        error: function (err) {
            Swal.fire({
                title: "Error",
                text: "Ocurrio un error al procesar la información",
                icon: "error",
                confirmButtonColor: "#cc0000",
                timer: 5000
            });
            console.log(err);
        }
    });
}

function setAutoValues(selected) {
    $(".step-4-nombre-auto").html(selected.dataset.autoName);
    $(".step-4-imagen-auto").attr("src", selected.dataset.autoPicture);
}

function getVersions(autoId) {
    $.ajax({
        url: window.config.urlbase + "/getVersion?id=" + autoId,
        beforeSend: showLoader,
        complete: hideLoader,
        success: function (data) {
            console.log(data);
            let opt = document.createElement("option");
            opt.value = "0";
            opt.innerHTML = "Versión";
            opt.attributes.disabled = true;

            $("#car_version").html(opt);
            data.versions.forEach(function (item) {
                opt = document.createElement("option");
                opt.value = item.precio;
                opt.innerHTML = `${item.descripcion_tipo} - ${item.descripcion}`;
                opt.dataset.anio = item.descripcion;
                opt.dataset.version = item.descripcion_tipo;

                $("#car_version").append(opt);
            });
        }
    })
}

function validateStepFour() {
    if (!$("#car_version").val()) {
        console.log("version invalida");
        return false;
    }
    else if ($("#select-personalidad-fiscal .select-button.selected").length != 1) {
        console.log("personalidad fiscal invalida");
        return false;
    }
    else if (!$("#select-state").val() || !$("#select-insurance").val() || !$("#select-coverage").val()) {
        console.log("estado-aseguradora-cobertura invalida");
        return false;
    }
    else if ($("#select-financing .select-button.selected").length != 1) {
        console.log("financiamiento invalida");
        return false;
    }
    else if ($("#select-financing .select-button.selected")[0].dataset.value === "Financiamiento" && $("#select-plan .select-button.selected").length != 1) {
        console.log("plan invalida");
        return false
    }
    else if ($("#select-financing .select-button.selected")[0].dataset.value === "Arrendamiento" && $("#select-arrendamiento .select-button.selected").length != 1) {
        console.log("arrendamiento invalida");
        return false
    }
    else if ($("#select-financing .select-button.selected")[0].dataset.value === "Arrendamiento" && !$("#select-cantidad-depositos").val()) {
        console.log("depositos invalida");
        return false
    }
    else if ($("#select-term .select-button.selected").length != 1) {
        console.log("plazo invalida");
        return false
    }
    else {
        return true;
    }
}

function getCountryStates() {
    $.ajax({
        method: 'get',
        url: window.config.urlbase + '/getCountryStates',
        beforeSend: showLoader,
        complete: hideLoader,
        success: function (data) {

            data.results.sort((a, b) => {
                if (a.descripcion > b.descripcion) {
                    return 1;
                }
                else if (a.descripcion < b.descripcion) {
                    return -1;
                }
                else {
                    return 0;
                }
            });

            data.results.forEach(function (item) {
                let state = document.createElement('option');
                state.value = item.id_estado;
                state.innerHTML = item.descripcion;

                $("#select-state").append(state);
            });
        }
    });
}

function getInsurers() {
    $.ajax({
        method: 'get',
        url: window.config.urlbase + '/getInsurers',
        beforeSend: showLoader,
        complete: hideLoader,
        success: function (data) {

            data.results.sort((a, b) => {
                if (a.descripcion > b.descripcion) {
                    return 1;
                }
                else if (a.descripcion < b.descripcion) {
                    return -1;
                }
                else {
                    return 0;
                }
            });

            data.results.forEach(function (item) {
                let insurer = document.createElement('option');
                insurer.value = item.id_aseguradora;
                insurer.innerHTML = item.descripcion;

                $("#select-insurance").append(insurer);
            });
        }
    });
}

function getCoverages() {
    $.ajax({
        method: 'get',
        url: window.config.urlbase + '/getCoverage?id=' + $("#select-insurance").val(),
        beforeSend: showLoader,
        complete: hideLoader,
        success: function (data) {

            data.results.sort((a, b) => {
                if (a.descripcion > b.descripcion) {
                    return 1;
                }
                else if (a.descripcion < b.descripcion) {
                    return -1;
                }
                else {
                    return 0;
                }
            });

            $("#select-coverage").html($("#select-coverage option")[0]);

            data.results.forEach(function (item) {
                let coverage = document.createElement('option');
                coverage.value = item.id_cobertura;
                coverage.innerHTML = item.descripcion;

                $("#select-coverage").append(coverage);
            });
        }
    });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function commitSalesforce() {

    var data = {
        Estado: form.Estado,
        Aseguradora: form.Aseguradora,
        Cobertura: form.Cobertura,
        Plan: form.PlanCotizar,
        Movil: form.Telefono,
        Email: form.emailCliente,
        Nombre: form.Nombre,
        Apellido: form.Apellido,
        AceptoTerminosYCondiciones: 'SiAcepto',
        Marca: form.Marca,
        Modelo: form.Modelo,
        Vesion: form.Vesion,
        TipoPersona: form.TipoPersona,
        Enganche: form.EngancheDeposito,
        Ballon: "text_ballon",
        DepositoGarantia: cotizacion.find(x => x.Plazo === Number(form.Plazo)).DepositoGarantia || "0",
    }

    $.ajax({
        type: 'POST',
        url: window.config.urlbase + '/SalesForceStep4',
        data: data,
        dataType: "json",
        success: function (result) {

            console.log(result);
        },
        error: function (err) {
            console.log(err);
            Swal.fire({
                title: "Error",
                text: "Error al enviar información a Salesforce",
                icon: "error",
                confirmButtonColor: "#cc0000",
                timer: 5000
            });
        }
    });
}

function getCantidadDepositos(autoId) {
    $.ajax({
        type: 'GET',
        url: window.config.urlbase + '/GetTypeUsePlan?id=' + autoId,
        success: function (result) {
            let opt = document.createElement('option');
            opt.value = -1;
            opt.innerHTML = "Cantidad de Depósitos";
            opt.setAttribute("disabled", true);
            opt.setAttribute("selected", true);
            $("#select-cantidad-depositos").html(opt);

            result.results.forEach(function (item) {
                opt = document.createElement('option');
                opt.value = item.descripcion;
                opt.innerHTML = item.descripcion;

                $("#select-cantidad-depositos").append(opt);
            });
        },
        error: function (err) {
            console.log(err);
            Swal.fire({
                title: "Error",
                text: "Ocurrio un error al intentar obtener datos del servicio",
                icon: "error",
                confirmButtonColor: "#cc0000",
                timer: 5000
            });
        }
    });
}

function clearValues() {
    form = {
        Nombre: form.Nombre,
        Apellido: form.Apellido,
        emailCliente: form.emailCliente,
        Telefono: form.Telefono,
    }

    $(".car-slide").removeClass("selected");
    $("#car_version").html($("#car_version option")[0]);
    $("#select-personalidad-fiscal .select-button").removeClass("selected");
    $("#select-state").val(0);
    $("#select-insurance").val(0);
    $("#select-coverage").val(0);
    $("#select-financing .select-button")[0].click();
    $(".select-plan .select-button").removeClass("selected");
    $(".select-arrendamiento .select-button").removeClass("selected");
    $("#select-cantidad-depositos").val(-1);
    $("#select-term .select-button").removeClass("selected");
    $("#hitch-range").attr("min", 0);
    $("#hitch-range").val(0);
    $("#hitch-text").html("$ 0 M.N.");

    cars_swiper.autoplay.start();
    window.scrollTo(0, 0);

    $("#step-5-distribuidores").val(0);
    $("#step-5-distribuidores").trigger("change");
    $("#step-5-phone").val("");
    $("#step-5-terms").prop("checked", false);
}

function sendDataSalesforce() {

    let _data = cotizacion.find(x => x.Plazo === Number(form.Plazo));

    if (_data) {
        var data = {
            "Mensualidad": formatter.format(_data.Mensualidad),
            "PrecioTotal": formatter.format(_data.PrecioTotal),
            "PagoMensual": formatter.format(_data.PagoMensual),
            "Enganche": formatter.format(_data.Enganche),
            "Marca": _data.Marca,
            "Modelo": _data.Modelo,
            "Vesion": _data.Vesion,
            "TipoPersona": _data.TipoPersona,
            "Estado": _data.Estado,
            "Aseguradora": _data.Aseguradora,
            "Cobertura": _data.Cobertura,
            "CAT": formatter.format(_data.CAT),
            "Plan": _data.Plan,
            "Ballon": "text_ballon",
            "Movil": $("#step-5-phone").val(),
            "Email": form.emailCliente,
            "Nombre": form.Nombre,
            "Apellido": form.Apellido,
            "Comision": formatter.format(_data.Comision),
            "PorcentajeComision": formatter.format(_data.PorcentajeComision),
            "Plazo": form.Plazo,
            "Anualidad": formatter.format(_data.Anualidad),
            "DepositoGarantia": formatter.format(_data.DepositoGarantia),
            "AceptoTerminosYCondiciones": 'SiAcepto',
            "CodigoDistribuidor": $("#step-5-distribuidores").select2('data')[0].codigo,
            "EstadoSeleccionado": _data.Estado,
        }

        $.ajax({
            type: 'POST',
            url: window.config.urlbase + '/SalesForce',
            data: data,
            dataType: "json",
            beforeSend: showLoader,
            complete: hideLoader,
            success: function (result) {
                Swal.fire({
                    title: "¡Gracias!",
                    text: "Nos pondremos en contacto contigo",
                    icon: "success",
                    confirmButtonColor: "#66bb6a"
                });

                $("#step-5-distribuidores").val(0);
                $("#step-5-distribuidores").trigger("change");
                $("#step-5-phone").val("");
                $("#step-5-terms").prop("checked", false);
            },
            error: function (err) {
                console.log(err);
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al enviar información, intenta mas tarde.",
                    icon: "error",
                    confirmButtonColor: "#cc0000",
                    timer: 5000
                });
            }
        });
    }


}