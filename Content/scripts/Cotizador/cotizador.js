var auto;

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

    const swiper = new Swiper('#cotizador-swiper-container', {
        speed: 400,
        allowTouchMove: false,
        initialSlide: 2
    });

    //new WebkitInputRangeFillLower({
    //    selectors: ['hitch-range'],
    //    color: '#cc0000'
    //});

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
        }
    })

    $("#step-2-continue").click(() => {
        if ($("#step-2-form").valid()) {
            if ($("#step-2-terms").prop("checked")) {
                swiper.slideNext();
            } else {
                termsCheckbox = "#step-2-terms";
                openModal("newsletterTermsModal");
            }
        }
    });

    //----------------STEP 3----------------

    const cars_swiper = new Swiper('#cars-swiper-container', {
        speed: 400,
        //allowTouchMove: false,
        slideToClickedSlide: true,
        slidesPerView: 4,
        spaceBetween: 30,
        autoplay: {
            delay: 3000,
        },
        loop: true,
        navigation: {
            nextEl: '#cars-swiper-next',
            prevEl: '#cars-swiper-prev'
        }
    });

    $(".select-car").click(function () {
        $(".car-slide").removeClass("selected");
        $(this).parent().addClass("selected");
        console.log(this.parentNode.dataset.autoId);
        $("#step-3-continue").removeAttr("disabled");
    });

    $(".car-slide").click(function () {
        $(".car-slide").removeClass("selected");
        $(this).addClass("selected");
        $("#step-3-continue").removeAttr("disabled");
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

        //let opt = document.createElement("option");
        //opt.value = "0";
        //opt.innerHTML = "Versión";
        //opt.attributes.disabled = true;

        //$("#car_version").html(opt);
    });

    $("#step-3-continue").click(function () {

        if ($(".car-slide.selected").length > 0) {
            let selected = $(".car-slide.selected")[0];

            $.when(
                auto = {
                    name: selected.dataset.autoName,
                    autoId: selected.dataset.autoId,
                    picture: selected.dataset.autoPicture
                },
                setAutoValues(selected)
            )
                .then(() => swiper.slideNext());

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
        swiper.slidePrev();
    });

    $("#car_version").change(function (e) {
        auto["price"] = $(this).val();
        auto["hitch"] = $(this).val() / 10;

        $("#hitch-range").attr("min", auto.hitch);
        $("#hitch-range").val(auto.hitch);
        $("#hitch-text").html("$ " + auto.hitch + " M.N.");
    });

    $(".select-button").click(function () {
        let container = this.dataset.for;

        $(`#select-${container} .select-button`).removeClass("selected");
        $(this).addClass("selected");
    });

    $("#select-insurance").change(() => getCoverages());

    $("#hitch-range").change(function () {
        auto.hitch = $("#hitch-range").val();
        $("#hitch-text").html("$ " + Number(auto.hitch).toFixed(2) + " M.N.");
    });

    $("#hitch-minus").click(function () {
        let val = $("#hitch-range").val();
        let calc = Number(val) - 5000;
        if (calc >= (auto.price / 10)) {
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
            swiper.slideNext();
        }
        else {
            Swal.fire({
                title: "Por favor complete todos los datos para continuar",
                icon: "error",
                confirmButtonColor: '#cc0000'
            })
        }
    });

});

function setAutoValues(selected) {
    console.log(selected);
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
    else if ($("#select-plan .select-button.selected").length != 1) {
        console.log("plan invalida");
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

document.addEventListener('DOMContentLoaded', () => {
    /*const myRanges = new WebkitInputRangeFillLower({ selectors: 'hitch-range', color: '#cc0000' });*/
});