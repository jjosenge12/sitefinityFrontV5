var form = {}, swiper, cars_swiper, cotizacion;

$(document).ready(function () {
    jQuery.validator.addMethod(
        "selectRequired",
        function (value, element) {
            return [0, "0", "", "null", "undefined"].indexOf(String(value)) === -1;
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

    //new WebkitInputRangeFillLower({
    //    selectors: ['hitch-range'],
    //    color: '#cc0000'
    //});

    $(".select-button").click(function () {
        let container = this.dataset.for;

        $(`#select-${container} .select-button`).removeClass("selected");
        $(this).addClass("selected");
    });

    //----------------STEP 1----------------

    $("#start").click(() => swiper.slideNext());

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
            },
            phone: {
                required: true
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
                form["Telefono"] = $("#phone").val();

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
                slideToClickedSlide: true,
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
    });

    $("#select-insurance").change(() => getCoverages());

    $("#select-personalidad-fiscal .select-button").click(function () {
        if (this.dataset.value === "Física") {
            $("#select-financing .select-button")[0].classList.add("selected");
            $("#select-financing .select-button")[0].click();
            $("#select-financing .select-button")[1].style.display = "none";
            $("#select-arrendamiento .select-button.selected")[0]?.classList.remove("selected");
        }
        else {
            $("#select-financing .select-button")[1].style.display = "flex";
        }
    });

    $("#select-financing .select-button").click(function () {
        switch (this.dataset.value) {
            case "Financiamiento":
                $("#title-financiamiento").html("financiamiento");
                $("#select-plan").show();
                $("#select-arrendamiento").hide();
                $("#select-arrendamiento .select-button.selected")[0]?.classList.remove("selected");
                break;
            case "Arrendamiento":
                $("#title-financiamiento").html("arrendamiento");
                $("#select-plan").hide();
                $("#select-arrendamiento").show();
                $("#select-plan .select-button.selected")[0]?.classList.remove("selected");
                break;
        }
    });

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

    $("#step-5-contact").click(() => {
        if ($("#step-5-contact-form").valid()) {
            if ($("#step-5-terms").prop("checked")) {
                alert("contact valido");

                form = {
                    ...form,
                    distribuidor: $("#step-5-distribuidores").val(),
                    phoneClient: $("#step-5-phone").val()
                }

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
        CantidadDepositosGarantia: 0,
    }
    console.log(form);
}

function showResults(data) {
    var _data = data.filter(x => x.Plazo == form.Plazo)[0];

    $(".step-5-nombre-cliente").html(_data.Nombre);
    $(".step-5-nombre-auto").html(_data.Marca);
    $(".step-5-version-auto").html(_data.Vesion);
    $(".step-5-anio-auto").html(_data.Anio);
    $(".step-5-tipo-persona").html(_data.TipoPersona);
    $(".step-5-imagen-auto").attr("src", form.imagenAuto);
    $(".step-5-mensualidad").html(`$ ${numberWithCommas(_data.Mensualidad.toFixed(2))} M.N.`);
    $(".step-5-enganche").html(`$ ${numberWithCommas(_data.Enganche.toFixed(2))} M.N.`);
    $(".step-5-plazo").html(_data.Plazo + " Meses");
    $(".step-5-precio-total").html(`$ ${numberWithCommas(_data.PrecioTotal.toFixed(2))} M.N.`);
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
            break;
        case "Balloon":
            $(".step-5-plan").attr("src", "/Content/images/Planes/plan-balloon.png");
            break;
        case "Anualidades":
            $(".step-5-plan").attr("src", "/Content/images/Planes/plan-anualidades.png");
            break;
    }

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
            //console.log(err);
            $('.TablaCotizar5').css('display', 'none');
            $('#FrmPaso5').css('display', 'none');
            $('#statusImgC').attr('src', errImg);
            $('#messageC').html('<span>Ocurrio un error al procesar la información</span>');
            $('#MyModalCotizador').modal('show');
            return;
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
        DepositoGarantia: "0",
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