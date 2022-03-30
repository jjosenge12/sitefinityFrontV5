

var form = {}, swiper, cars_swiper, cotizacion, car_slides, enganche_porcen,enganche_width,back,plan,token,idcoti;

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

function scrollToTargetAdjusted(element) {
    
    var headerOffset = 0;    
    var elementPosition = element.offsetTop;
    var offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}

function formNextStep(step) {
    let next = $(`.step-4-${step}`)[0];

    if (next !== null && next !== undefined) {
        $.when(
            $(`.step-4-${step}`).map((idx, item) => item.style.removeProperty("display")),
            swiper.updateAutoHeight(0)
        )
            .then(() => scrollToTargetAdjusted(next));
    }
}

$(document).ready(function () {
    
    car_slides = $(".swiper-slide.car-slide-container");

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
        getToken();
    });

    //----------------STEP 2----------------

    $("#step-2-form").validate({
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
                isEmail: true
            }
        }
    });

    $("#step-2-terms").click(function (e) {
        if ($("#step-2-terms").prop("checked")) {
            e.preventDefault();
            termsCheckbox = "#step-2-terms";
            openModal("newsletterTermsModal");
        }
    });

    $("#step-2-terms-btn").click(function () {
        termsCheckbox = "#step-2-terms";        
        window.open(
            window.location.origin + "/terminos-de-servicio",
            "_blank"
        );
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
                //slidesPerColumnFill: 'column',
                slidesPerView: 4,
                slidesPerColumn: 1,
                //loop: true,
            }
        },
        navigation: {
            nextEl: '#cars-swiper-next',
            prevEl: '#cars-swiper-prev'
        }
    });

    $("#select-car-type .select-button").click(function () {
        let type = `type-${this.dataset.value}`;

        cars_swiper.removeAllSlides();
        car_slides.map((idx, item) => item.children[0].classList.remove("selected"))
        cars_swiper.addSlide(1, car_slides.filter((idx, item) => item.classList.contains(type)));

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
        cars_swiper.autoplay.start();
    });
    $("#select-car-type .select-button")[0].click();

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
        $(".step-2-form .sf-form-container .float-container").addClass("active");

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
                    ImagenAuto: selected.dataset.autoPicture,
                    ImagenModelo: selected.dataset.autoModel,
                    TipoAuto: selected.dataset.autoTipo
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
        progress_val = 0;
        progress.style.width = progress_val + "%";
        $("#porcentaje").html("10%");
        $("#step-4-finish").hide();
        fisica = 0;
        swiper.updateAutoHeight(0);
    });

    $("#car_version").change(function (e) {
        form = {
            ...form,
            Vesion: $("#car_version option:selected")[0].dataset.version,
            Anio: $("#car_version option:selected")[0].dataset.anio,
            precioAuto: $(this).val(),
            EngancheDeposito: $(this).val() / 10, // Cota minima de enganche (10% del precioAuto)
            MaxEnganche: $(this).val() * .4
        }
        progress_val = 0;
        progress.style.width = progress_val + "%";
        $("#porcentaje").html("10%");
        $("#hitch-range").attr("min", form.EngancheDeposito);
        $("#hitch-range").attr("max", form.MaxEnganche);
        $("#hitch-range").val(form.EngancheDeposito);
        $("#hitch-text").val(form.EngancheDeposito.toFixed(2));
        $("#hitch-max").val(form.MaxEnganche);
        $("#hitch-min").val(form.precioAuto * .1);

        formNextStep(2);
    });

    $("#select-insurance").change(() => getCoverages());

$("#select-state").change(() => {
        if ($("#select-state").val() && $("#select-coverage").val()) {
            if (fisica == 1 || fisicaEmp == 1) {
                $(".title-financiamiento").html("financiamiento");
                $(".title-enganche").html("enganche");
                $("#select-plan").show();
                $("#select-arrendamiento").hide();
                $("#data-depositos").hide();
                $("#step4").show();
                $("#select-arrendamiento .select-button.selected")[0]?.classList.remove("selected");
                planes = 1;
                swiper.updateAutoHeight(0);
                formNextStep(5);
                console.log(planes);
                formNextStep(5);
            }
            else
                formNextStep(4);
        }
    });

    $("#select-coverage").change(() => {
        if ($("#select-state").val() && $("#select-coverage").val()) {
            if (fisica == 1 || fisicaEmp == 1) {
                $(".title-financiamiento").html("financiamiento");
                $(".title-enganche").html("enganche");
                $("#select-plan").show();
                $("#select-arrendamiento").hide();
                $("#data-depositos").hide();
                $("#step4").show();
                $("#select-arrendamiento .select-button.selected")[0]?.classList.remove("selected");
                planes = 1;
                swiper.updateAutoHeight(0);
                formNextStep(5);
                console.log(planes);
                formNextStep(5);
            }
            else
                formNextStep(4);
        }
    });
    var fisica,fisicaEmp;
    $("#select-personalidad-fiscal .select-button").click(function () {
        if (this.dataset.value === "Física" || this.dataset.value === "F�sica" || this.dataset.value === "Física con Actividad Empresarial" || this.dataset.value === "F�sica con Actividad Empresarial") {
            $("#select-financing .select-button")[1].style.display = "none";
            $("#select-arrendamiento .select-button.selected")[0]?.classList.remove("selected");
            $("#select-financing .select-button")[1].classList.remove("selected");
            $("#select-financing .select-button")[0].classList.add("selected");
            $("#select-term .select-button")[0].classList.remove("selected");
            $("#select-term .select-button")[1].classList.remove("selected");
            $("#select-term .select-button")[2].classList.remove("selected");
            fisica = 1;
            fisicaEmp = 1;
            planes = 1;
            $(".step-4-4").hide();
            $("#select-financing").hide();
            $(".title-financiamiento").html("financiamiento");
            $(".title-enganche").html("enganche");
            $("#select-plan").show();
            $("#select-arrendamiento").hide();
            $("#data-depositos").hide();
            $("#step4").show();
            //$("#step-4-finish").show();

        }
        else {
            $("#select-financing .select-button")[1].style.display = "flex";
            if ((fisica == 1 || fisicaEmp == 1) && ($("#select-state").val() && $("#select-coverage").val())) {
                $(".step-4-4").show();
                $("#select-financing").show();
            }
            fisica = 0;
            fisicaEmp = 0;
        }

        formNextStep(3);
    });

    var planes;
    $("#select-financing .select-button").click(function () {
        if (fisica != 1 || fisicaEmp!=1)
            fisica = this.dataset.value
        else
            fisica = "Financiamiento"
        switch (fisica) {
            case "Financiamiento":
                $(".title-financiamiento").html("financiamiento");
                $(".title-enganche").html("enganche");
                $("#select-plan").show();
                $("#select-arrendamiento").hide();
                $("#data-depositos").hide();
                $("#step4").show();
                $("#select-arrendamiento .select-button.selected")[0]?.classList.remove("selected");
                planes = 1;
                break;
            case "Arrendamiento":
                $(".title-financiamiento").html("arrendamiento");
                $(".title-enganche").html("depósito");
                $("#select-plan").hide();
                $("#step4").hide();
                $("#select-arrendamiento").show();
                $("#data-depositos").show();
                $("#select-plan .select-button.selected")[0]?.classList.remove("selected");
                planes = 0;
                fisica = 0;
                break;
        }
        swiper.updateAutoHeight(0);
        formNextStep(5);
        console.log(planes);
    });

    $("#select-plan .select-button").click(function () { formNextStep(7); plan = this.dataset.value; });
    $("#select-arrendamiento .select-button").click(function () { formNextStep(6); plan = this.dataset.value; });
    $("#select-term .select-button").click(function () {
        if (planes == 1) {
            formNextStep(8);
            swiper.updateAutoHeight(0);
            $("#finish").show();
        }
        else
            formNextStep(9);
            swiper.updateAutoHeight(0);
            $("#step-4-finish").show();

    });

    $("#select-cantidad-depositos").change(function () { formNextStep(7); });

    
    var progress = document.getElementById("progressBar");

    $("#hitch-range").change(function () {
        form.hitch = $("#hitch-range").val();
        $("#hitch-text").val(Number(form.hitch).toFixed(2));
        let porcentaje = (form.hitch * 100) / form.precioAuto;
        $("#porcentaje").html(porcentaje.toFixed(0) + " %");

        // form.EngancheDeposito es el Enganche Minimo (10% del precio del auto)
        /* Codigo para aumentar o disminuir la barra de progreso */        
        let diferenciaMax = (form.MaxEnganche - form.EngancheDeposito);
        let progress_val = (($("#hitch-range").val() - form.EngancheDeposito) * 100) / diferenciaMax;
        progress.style.width = progress_val + "%";
    });

    $("#hitch-minus").click(function () {
        let val = $("#hitch-range").val();
        let calc = Number(val) - 5000;
                
        if (calc < form.EngancheDeposito )
            calc = form.EngancheDeposito;

        let porcentaje = (calc * 100) / form.precioAuto;

        $("#hitch-range").val(calc);
        $("#hitch-range").change();
        $("#porcentaje").html(porcentaje.toFixed(0) + " %");        
        $("#hitch-text").val(calc.toFixed(2));

        /* Sentencias para aumentar o disminuir la barra de progreso */        
        let diferenciaMax = (form.MaxEnganche - form.EngancheDeposito);
        let progress_val = (($("#hitch-range").val() - form.EngancheDeposito) * 100) / diferenciaMax;
        progress.style.width = progress_val + "%";        
    });

    $("#hitch-plus").click(function () {
        let val = $("#hitch-range").val();
        let calc = Number(val) + 5000, max = form.MaxEnganche;
        
        if (calc > max)
            calc = max;

        let porcentaje = (calc * 100) / form.precioAuto;
                        
        $("#hitch-range").val(calc);
        $("#hitch-range").change();
        $("#porcentaje").html(porcentaje.toFixed(0) + " %");        
        $("#hitch-text").val(calc.toFixed(2));

        // form.EngancheDeposito es el Enganche Minimo (10% del precio del auto)
        /* Codigo para aumentar o disminuir la barra de progreso */
        let diferenciaMax = (form.MaxEnganche - form.EngancheDeposito);
        let progress_val = (($("#hitch-range").val() - form.EngancheDeposito) * 100) / diferenciaMax;
        progress.style.width = progress_val + "%";
       
    });


    $("#hitch-text").on('keyup', function (e) {
        let val = Number($(this).val());
        console.log(val);

        // Utilizo form.EngancheDepostio como cota inferior, es el minimo enganche(10% del precio del auto)
        if (val >= form.EngancheDeposito && val <= form.MaxEnganche) {
            console.log("valid")
            $("#hitch-range").val(val);
            let porcentaje = (val * 100) / form.precioAuto;
            $("#porcentaje").html(porcentaje.toFixed(0) + " %");

            /* Codigo para aumentar o disminuir la barra de progreso */                        
            let diferenciaMax = (form.MaxEnganche - form.EngancheDeposito);
            let progress_val = (($("#hitch-range").val() - form.EngancheDeposito) * 100) / diferenciaMax;
            progress.style.width = progress_val + "%";
        }
    });

    $("#hitch-text").blur(function () {
        let val = this.value;
        if (val < (form.precioAuto / 10)) {
            Swal.fire({
                title: "Error",
                text: "El monto mínimo de enganche es el 10% del valor del vehículo: " + form.precioAuto / 10 + ",00 M.N.",
                icon: "error",
                confirmButtonColor: '#cc0000'
            })
            let valBarra = $("#hitch-range").val();
            this.value = valBarra;

            $("#hitch-text").val((Number(this.value)).toFixed(2));
        }
        else {
            if (val > form.MaxEnganche) {
                let valBarra = $("#hitch-range").val();
                this.value = valBarra;

                $("#hitch-text").val((Number(this.value)).toFixed(2));
            }
            else {
                $("#hitch-text").val((Number(val)).toFixed(2));
            }
        }

        /*if (val < (form.precioAuto / 10) || val > form.MaxEnganche) {
            let valBarra = $("#hitch-range").val();
            this.value = valBarra;
        }*/
    });




    $("#step-4-finish").click(function () {
        if (validateStepFour()) {
            //progress_val = 0;
            //progress.style.width = progress_val + "%";
            //$("#porcentaje").html("10%")
            enganche_porcen = $("#porcentaje").html();
            enganche_width = progress.style.width;
            $.when(getFormValues())
                .then(() => {
                    cotizar();
                }).then(() => {
                    switch (plan) {
                        case "Tradicional":
                            $("#tradicional").show();
                            break;
                        case "Anualidades":
                            $("#anualidades").show();
                            break;
                        case "Balloon":
                            $("#balloon").show();
                            break;
                        case "financiero":
                            $("#arrendamiento").show();
                            break;
                        case "puro":
                            $("#arrendamiento").show();
                            break;
                    }
                    back = 0;
                });
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
        
        window.open(
            window.location.origin + "/terminos-de-servicio",
            "_blank"
        );
    });

    $("#step-5-terms").click(function () {
        termsCheckbox = "#step-5-terms";        
    });

    $("#select-otro-plazo .select-button").click(function () {
        $.when(form.Plazo = this.dataset.value)
            .then(() => showResults(cotizacion));
    });


    $("#cotizar-otro").click(function () {
        $.when(clearValues())
            .then(() => {
                swiper.slideTo(2, 0);
                $("#step-4-finish").hide();
            });
        progress_val = 0;
        progress.style.width = progress_val + "%";
        $("#porcentaje").html("10%");
        fisica = 0;
        $("#arrendamiento").hide();
        $("#anualidades").hide();
        $("#balloon").hide();
        $("#tradicional").hide();
        back = 0;
    });

    $("#step-5-contact").click(() => { 
        sendDataSalesforce();
    });

    $("#step-5-back").click(() => {
        swiper.slidePrev();
        //$("#porcentaje").html(enganche_porcen);
        //progress.style.width = enganche_width;
        form.hitch = form.EngancheDeposito;
        form.EngancheDeposito = form.precioAuto * .1;
        form.MaxEnganche = form.precioAuto * .4;
        $("#hitch-max").val(form.MaxEnganche);
        $("#hitch-min").val(form.precioAuto * .1);
        back = 1;

    });

    $("#downloadPdf").click(function () {

        var data = {
            DatosCotizar: cotizacion,
            Plazo: form.Plazo,
            ImagenAuto: window.config.origin + '/' + form.ImagenAuto,
            ImagenModelo: form.ImagenModelo ? window.config.origin + '/' + form.ImagenModelo : form.ImagenModelo,
            PrecioAuto: form.precioAuto,
        };

        console.log(data.ImagenAuto);


        $.ajax(window.config.urlbase + "/DownloadPlanPdf", {
            method: 'POST',
            beforeSend: showLoader,
            complete: hideLoader,
            data: data,
            success: function (res) {
                console.log(res);

                var _data = base64ToArrayBuffer(res.result);
                var blob = new Blob([_data], { type: "application/pdf" });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                var fileName = "Cotizacion_Toyota";
                link.download = fileName;
                link.click();

            },
            error: function (err) {
                console.log(err);
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error generar el pdf",
                    icon: "error",
                    confirmButtonColor: "#cc0000",
                    timer: 5000
                });
            }
        });
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
        ImagenAuto: $(".car-slide.selected")[0].dataset.autoPicture,
        ImagenModelo: $(".car-slide.selected")[0].dataset.autoModel,
        Vesion: $("#car_version option:selected")[0].dataset.version,
        Anio: $("#car_version option:selected")[0].dataset.anio,
        Modelo: $("#car_version option:selected")[0].dataset.anio,
        precioAuto: $("#car_version").val(),
        EngancheDeposito: $("#hitch-range").val(),
        TipoPersona: normalize($("#select-personalidad-fiscal .select-button.selected")[0].dataset.value),
        Estado: $("#select-state option:selected")[0].innerHTML,
        Aseguradora: $("#select-insurance option:selected")[0].innerHTML,
        Cobertura: $("#select-coverage option:selected")[0].innerHTML,
        PlanCotizar: $("#select-financing .select-button.selected")[0].dataset.value === "Financiamiento" ? $("#select-plan .select-button.selected")[0].dataset.value : "Arrendamiento " + $("#select-arrendamiento .select-button.selected")[0].dataset.value,
        Plazo: $("#select-term .select-button.selected")[0].dataset.value,
        TipoUso: "Depósitos de Garantía",
        CantidadDepositosGarantia: $("#select-cantidad-depositos").val(),
    }
}

function showResults(data) {
    var _data = data.filter(x => x.Plazo == form.Plazo)[0];

    $(".step-5-nombre-cliente").html(_data.Nombre.trim());
    $(".step-5-nombre-auto").html(_data.Marca);
    $(".step-5-version-auto").html(_data.Vesion);
    $(".step-5-anio-auto").html(_data.Anio);
    $(".step-5-tipo-persona").html(normalize(_data.TipoPersona));
    $(".step-5-imagen-auto").attr("src", form.ImagenAuto);
    $(".step-5-mensualidad").html(`$ ${numberWithCommas(_data.Mensualidad.toFixed(2))} M.N.`);
    $(".step-5-enganche").html(`$ ${numberWithCommas(_data.Enganche.toFixed(2))} M.N.    (${enganche_porcen})`);
    $(".step-5-deposito").html(`${_data.DepositoGarantia} `);
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
                }).then(function () {
                    window.location = '/cotizador';
                });
                console.log(result.data.Message);
            } else {

                if (result.data.Prices.length > 0) {
                    cotizacion = result.data.Prices;
                    showResults(result.data.Prices);
                    if (back == 1)
                        updateSalesforce2();
                    else
                        commitSalesforce2();

                } else {
                    Swal.fire({
                        title: "Error",
                        text: "No existe información para la versión seleccionada",
                        icon: "error",
                        confirmButtonColor: "#cc0000",
                        timer: 5000
                    }).then(function () {
                        window.location = '/cotizador';
                    });
                    console.log(result.data.Message);
                }
            }
        },
        error: function (err) {
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al procesar la información",
                icon: "error",
                confirmButtonColor: "#cc0000",
                timer: 5000
            }).then(function () {
                window.location = '/cotizador';
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
            let opt = document.createElement("option");
            opt.value = "0";
            opt.innerHTML = "Versión";
            opt.setAttribute("disabled", true);
            opt.setAttribute("selected", true);

            $("#car_version").html(opt);
            console.log()
            let _data = data.versions.filter((item, idx) => item.tipo_carrusel.toLowerCase() === form.TipoAuto);
            _data.forEach(function (item) {
                opt = document.createElement("option");
                opt.value = item.precio;
                opt.innerHTML = `${item.descripcion_tipo} - ${item.descripcion}`;
                opt.dataset.anio = item.descripcion;
                opt.dataset.version = item.descripcion_tipo;
                opt.dataset.tipo = item.tipo_carrusel.toLowerCase();

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

            var listCoverage;

            // Se ordena las coberturas 

            if (data.results.length == 4) {
                listCoverage = [data.results[3], data.results[0], data.results[1], data.results[2]];
                data.results = listCoverage;
            }
            else {
                if (data.results.length == 5) {
                    listCoverage = [data.results[3], data.results[0], data.results[1], data.results[2], data.results[4]];
                    data.results = listCoverage;
                }
            }                       

            /*
            Funcion para ordenar alfabeticamente las coberturas
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
            });*/

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
        Mensualidad: formatter.format(cotizacion.find(x => x.Plazo === Number(form.Plazo)).Mensualidad),
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
        Plazo: form.Plazo,
        Ballon: "text_ballon",
        DepositoGarantia: cotizacion.find(x => x.Plazo === Number(form.Plazo)).DepositoGarantia || "0",
        Precio: form.precioAuto,
        ImagenAuto: form.ImagenAuto,
    }
    

    $.ajax({
        type: 'POST',
        url: window.config.urlbase + '/SalesForceStep4',
        data: data,
        dataType: "json",
        success: function (result) {
            window.scrollTo(0, 0);
            swiper.slideNext();
            console.log(result);
        },
        error: function (err) {
            console.log('ERROR OBTENER DATOS DE SERVICIO');
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
                text: "Ocurrió un error al intentar obtener datos del servicio, por favor vuelva a intentarlo más tarde",
                icon: "error",
                confirmButtonColor: "#cc0000",
                timer: 5000
            }).then(function () {
                window.location = '/cotizador';
            })
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
    $("#select-plan .select-button").removeClass("selected");
    $(".select-arrendamiento .select-button").removeClass("selected");
    $("#select-cantidad-depositos").val(-1);
    $("#select-term .select-button").removeClass("selected");
    $("#hitch-range").attr("min", 0);
    $("#hitch-range").val(0);
    $("#hitch-text").html("$ 0 M.N.");
    $("#select-otro-plazo .select-button").removeClass("selected");

    cars_swiper.autoplay.start();

    $("#step-5-distribuidores").val(0);
    $("#step-5-distribuidores").trigger("change");
    $("#step-5-phone").val("");
    $("#step-5-terms").prop("checked", false);

    for (let i = 1; i <= 8; i++) {
        $(`.step-4-${i}`).map((idx, item) => item.style.display = "none");
    }
    window.scrollTo(0, 0);
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
            "Distribuidor": $("#step-5-distribuidores").find(':selected')[0].innerHTML,
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
                console.log(result);
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

function initilizeCarsSwiper() {
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
                slidesPerView: 4,
                slidesPerColumn: 1,
            }
        },
        navigation: {
            nextEl: '#cars-swiper-next',
            prevEl: '#cars-swiper-prev'
        }
    });
}

function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

var normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
        to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
        mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
        mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
        var ret = [];
        for (var i = 0, j = str.length; i < j; i++) {
            var c = str.charAt(i);
            if (mapping.hasOwnProperty(str.charAt(i)))
                ret.push(mapping[c]);
            else
                ret.push(c);
        }
        return ret.join('');
    }

})();

$(document).keydown(function (objEvent) {
    if (objEvent.keyCode == 9) {
        objEvent.preventDefault();
    }
});

function maxLengthCheck(object) {
    var ch = String.fromCharCode(object.which);
    if (!(/[0-9]/.test(ch)))
        object.preventDefault();

}

function getToken(){
    $.ajax({
        type: 'GET',
        url: window.config.urlbase + '/GetAccessToken',
        success: function (result) {
            token = result.result;
            console.log(result);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function commitSalesforce2() {
    let mensualidad = formatter.format(cotizacion.find(x => x.Plazo === Number(form.Plazo)).Mensualidad);
    let mensu = mensualidad.substr(1, mensualidad.length);
    mensu = mensu.replace(',', '');
    var data = {
        state: form.Estado,
        FWY_Aseguradora__c: form.Aseguradora,
        Mensualidad__c: mensu,
        Cobertura__c: form.Cobertura,
        FWY_Tipo_de_plan__c: form.PlanCotizar,
        MobilePhone: form.Telefono,
        Email: form.emailCliente,
        FirstName: form.Nombre,
        LastName: form.Apellido,
        FWY_Veh_culo__c: form.Marca,
        FWY_Versi_n__c: form.Modelo,
        FWY_Modelo__c: form.Vesion,
        FWY_Tipo_de_persona__c: form.TipoPersona,
        FWY_Enganche_Monto__c: form.EngancheDeposito,
        Plazo__c: form.Plazo,
        FWY_Balloon__c: "text_ballon",
        Depositos_Garantia__c: cotizacion.find(x => x.Plazo === Number(form.Plazo)).DepositoGarantia || "0",
        Precio_Auto__c: form.precioAuto,
        ImagenAuto__c: form.ImagenAuto,
        LeadSource: "Cotizador Web paso 4",
        Company: "Example",
        }; 

    let datajson = JSON.stringify(data);

    $.ajax({
        type: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        url: "https://toyotafinancial--salt001.my.salesforce.com/services/data/v54.0/sobjects/Lead/",
        data: datajson,
        success: function (result) {
            window.scrollTo(0, 0);
            swiper.slideNext();
            console.log(result);
            idcoti = result.id;
        },
        error: function (err) {
            console.log('ERROR OBTENER DATOS DE SERVICIO');
            console.log(data);
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

function updateSalesforce2() {
    let mensualidad = formatter.format(cotizacion.find(x => x.Plazo === Number(form.Plazo)).Mensualidad);
    let mensu = mensualidad.substr(1, mensualidad.length);
    mensu = mensu.replace(',', '');
    var data = {
        state: form.Estado,
        FWY_Aseguradora__c: form.Aseguradora,
        Mensualidad__c: mensu,
        Cobertura__c: form.Cobertura,
        FWY_Tipo_de_plan__c: form.PlanCotizar,
        MobilePhone: form.Telefono,
        Email: form.emailCliente,
        FirstName: form.Nombre,
        LastName: form.Apellido,
        FWY_Veh_culo__c: form.Marca,
        FWY_Versi_n__c: form.Modelo,
        FWY_Modelo__c: form.Vesion,
        FWY_Tipo_de_persona__c: form.TipoPersona,
        FWY_Enganche_Monto__c: form.EngancheDeposito,
        Plazo__c: form.Plazo,
        FWY_Balloon__c: "text_ballon",
        Depositos_Garantia__c: cotizacion.find(x => x.Plazo === Number(form.Plazo)).DepositoGarantia || "0",
        Precio_Auto__c: form.precioAuto,
        ImagenAuto__c: form.ImagenAuto,
        LeadSource: "Cotizador Web paso 4",
        Company: "Example",
    };

    let datajson = JSON.stringify(data);
    console.log("Update");

    $.ajax({
        type: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        url: "https://toyotafinancial--salt001.my.salesforce.com/services/data/v54.0/sobjects/Lead/"+idcoti,
        data: datajson,
        success: function (result) {
            window.scrollTo(0, 0);
            swiper.slideNext();
            console.log(result);
        },
        error: function (err) {
            console.log('ERROR OBTENER DATOS DE SERVICIO');
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