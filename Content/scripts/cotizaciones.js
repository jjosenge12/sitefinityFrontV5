var eliminarCotizacionModal = "eliminarCotizacionModal";
var cotizaciones2, form, nroPdf = 0, fechaCotizacion, imagenAuto, oksales = 0,token;

function capitalize(str) {
    return str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
}

function getToken() {
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
                bindEvents(input);

                if (input.value) {
                    element.classList.add("active");
                }
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

$(document).ready(() => {
    // Se obtienen los valores de los parámetros email y token que llegan en la url para hacer el request.
    var url_string = window.location.href;
    var url = new URL(url_string);
    // Se almacenan en Session Storage.
    var _paramEmail = sessionStorage.getItem("email");
    var _paramToken = sessionStorage.getItem("token");

    let _data = {
        email: _paramEmail,
    };

    let _myHeader = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "Access-Control-Allow-Credentials": true,
    };
              
    const settings = {
        method: "POST",
        headers: _myHeader,
        data: JSON.stringify(_data),
        beforeSend: showLoader,
        complete: hideLoader,
        success: (data) => {
            console.log(data);

            //Sección de Bienvenida Home Delivery
            var bannerBienvenida = "";
            if (data.esCliente[0].nombre)
                var nombre = data.esCliente[0].nombre;
            else
                var nombre = data.esCliente[0].apellido;
            var apellido = data.esCliente[0].apellido,
                isClient = data.esCliente[0].esCliente,
                esMoral = data.esCliente[0].tipoPersona;
            sessionStorage.setItem("name", capitalize(nombre));
            sessionStorage.setItem("lastname", capitalize(apellido));
            sessionStorage.setItem("isClient", isClient);
            $(".user-name").html(capitalize(nombre));
            //$("#link-portal").css("display", isClient === "true" ? "block" : "none");

            // Hola
            // Nos da mucho gusto que quieras ser parte de la familia Toyota.
            if (sessionStorage.getItem("isClient") === "true" && esMoral === 'MORAL') {
                bannerBienvenida +=
                    '<div class="col-md-1"></div><div class="col-md-7 mt-5">' +
                    '<p class="cotizaciones-p">Para continuar con tu proceso de financiamiento, es importante registres tus datos para ser contactado por el Distribuidor autorizado ' +
                    "Toyota más cercano a tu ciudad, ya que por el momento para tu régimen fiscal no esta habilitada esta opción.</p></div>" +
                    '<div class="col-md-3 mt-5 col d-flex align-items-center justify-content-center">' +
                    '<img src="/images/default-source/tfsm/my-tfsm/logo-home-delivery-lg.png?Status=Master&sfvrsn=bebd466a_3/Logo-home-delivery-lg" class="img-fluid" />' +
                    '</div><div class="col-md-1"></div>';
                $("#bannerBienvenida").append(bannerBienvenida);
                var dashboard = "";
                $("#dashboard").append(dashboard);
                document.querySelector('[data-id="step-5-contact-form"]').classList.add("d-block");
                getDealersByState("step-5-distribuidores");

            } else {
            if (sessionStorage.getItem("isClient") === "true") {
                bannerBienvenida +=
                    '<div class="col-md-1"></div><div class="col-md-7 mt-5">' +
                    '<h1 class="cotizaciones-title">Hola ' +
                    capitalize(nombre) +
                    "<br />Nos da mucho gusto que sigas siendo parte de la familia Toyota." +
                    '</h1><p class="cotizaciones-p">Te presentamos tu tablero Home Delivery. ' +
                    "En &eacute;l podr&aacute;s iniciar y darle seguimiento a tu proceso de financiamiento.</p></div>" +
                    '<div class="col-md-3 mt-5 col d-flex align-items-center justify-content-center">' +
                    '<img src="/images/default-source/tfsm/my-tfsm/logo-home-delivery-lg.png?Status=Master&sfvrsn=bebd466a_3/Logo-home-delivery-lg" class="img-fluid" />' +
                    '</div><div class="col-md-1"></div>';
            } else {
                bannerBienvenida +=
                    '<div class="col-md-1"></div><div class="col-md-7 mt-5">' +
                    '<h1 class="cotizaciones-title">Hola ' +
                    capitalize(nombre) +
                    "<br />Nos da mucho gusto que quieras ser parte de la familia Toyota." +
                    '</h1><p class="cotizaciones-p">Te presentamos tu tablero Home Delivery. ' +
                    "En &eacute;l podr&aacute;s iniciar y darle seguimiento a tu proceso de financiamiento.</p></div>" +
                    '<div class="col-md-3 mt-5 col d-flex align-items-center justify-content-center">' +
                    '<img src="/images/default-source/tfsm/my-tfsm/logo-home-delivery-lg.png?Status=Master&sfvrsn=bebd466a_3/Logo-home-delivery-lg" class="img-fluid" />' +
                    '</div><div class="col-md-1"></div>';
            } 
            $("#bannerBienvenida").append(bannerBienvenida);

            // Tablero Iniciar Cotización y Estatus de Procesos
            var dashboard = "";
            var sin_procesos_msj = "";
            dashboard +=
                '<div class="mt-5"><div class="col-md-6 p-5 cotizaciones-card">' +
                '<h3 class="cotizaciones-card-title">El mejor plan es estrenar un Toyota</h3><a href="/cotizador" class="btn cotizacion-btn mt-5">' +
                'iniciar cotizaci&oacute;n</a></div><div class="col-md-6 p-5 cotizaciones-card">' +
                '<h3 class="cotizaciones-card-title">Estatus de tu proceso de cr&eacute;dito</h3>' +
                '<div id="dashboard-msj"></div>';

            $("#dashboard").append(dashboard);

            var noCotizacionesHTML = "";
            var trCotizacionesHTML = "";
            var tableCotizacionesHTML = "";
            var closeTableCotizacionesHTML = "";
            var tableCotizacionesMobileHTML = "";

            // Sin cotizaciones.
            noCotizacionesHTML +=
                '<div class="col-md-12 cotizaciones-row p-5 mt-5">' +
                '<h3 class="cotizaciones-card-title">Cotizaciones realizadas</h3>' +
                '<div id="sin-cotizaciones"><div class="row mt-5">' +
                '<div class="col-md-5 text-right"><img src="/images/default-source/tfsm/my-tfsm/sin-cotizaciones.png" class="img-fluid" /></div>' +
                '<div class="col-md-5"><p class="table-text">No has realizado cotizaciones.<br />' +
                'Para iniciar un proceso de financiamiento, es necesario <a href="/cotizador"> iniciar una cotizaci&oacute;n</a>.' +
                "</div></div></div>";

            if (data.cotizaciones.length <= 0) {
                $("#cotizaciones").append(noCotizacionesHTML);
            } else {
                //CREACIÓN DE LA TABLA DE COTIZACIONES
                tableCotizacionesHTML +=
                    '<div class="col-md-12 cotizaciones-row p-5 mt-2 mb-3">' +
                    '<h3 class="cotizaciones-card-title">Cotizaciones realizadas</h3><div id="mis-cotizaciones"></div>' +
                    '<table id="cotizaciones_table" class="table cotizaciones-table mt-5 d-none d-md-table" id="con-cotizaciones mt-5"><thead>' +
                    '<tr><th scope="col">Veh&iacute;culo</th>' +
                    '<th scope="col">Versi&oacute;n</th><th scope="col">Fecha de cotizaci&oacute;n</th>' +
                    '<th scope="col">Modelo</th><th scope="col"></th></tr></thead><tbody>';

                $.each(data.cotizaciones, function (c, cotizacion) {
                    trCotizacionesHTML +=
                        `<tr><td><a class='pdf' id='${nroPdf}' style='color:red'>` +
                        cotizacion.vehiculo +
                        "</a></td><td>" +
                        cotizacion.version +
                        "</td><td>" +
                        cotizacion.fecha +
                        "</td><td>" +
                        cotizacion.modelo +
                        '</td><td><a class="' +
                        cotizacion.clickeable +
                        '" href="/tfsm/my-tfsm/solicitud-digital?lead=' +
                        cotizacion.id +
                        '">' +
                        cotizacion.etapa +
                        "</div></td>";

                    nroPdf++;

                    if (cotizacion.etapa !== "Solicitud en proceso") {
                        trCotizacionesHTML +=
                            '<td><img onclick="openModal(eliminarCotizacionModal)" data-lead="' +
                            cotizacion.id +
                            '" class="eliminarCotizacion" src="/images/default-source/tfsm/my-tfsm/fi_x" style="cursor:pointer;" />' +
                            "</td></tr>";
                    } else {
                        trCotizacionesHTML += "<td></td></tr>";
                    }
                });

                closeTableCotizacionesHTML += "</tbody></table></div>";
                nroPdf = 0;
                /*Mobile*/
                $.each(data.cotizaciones, function (c, cotizacion) {
                    tableCotizacionesMobileHTML +=
                        '<div class="container d-block d-md-none card pb-4">' +
                        '<div class="row tfs-fila">' +
                        '<div class="col-sm-12"><span class="mb-table-title float-left"></span>' +
                        '<span class="float-right">' +
                        '<img onclick="openModal(eliminarCotizacionModal)" data-lead="' +
                        cotizacion.id +
                        '" class="eliminarCotizacion" src="/images/default-source/tfsm/my-tfsm/fi_x" style="cursor:pointer;" />' +
                        "</span></div>" +
                        "</div>" +
                        '<div class="row tfs-fila">' +
                        '<div class="col-sm-12"><span class="mb-table-title float-left">Veh&iacute;culo</span>' +
                        `<span class="float-right pdf" id='${nroPdf}' style='color:red'>` +
                        cotizacion.vehiculo +
                        "</span></div>" +
                        "</div>" +
                        '<div class="row tfs-fila">' +
                        '<div class="col-sm-12"><span class="mb-table-title float-left">Versi&oacute;n</span>' +
                        '<span class="float-right">' +
                        cotizacion.version +
                        "</span></div>" +
                        "</div>" +
                        '<div class="row tfs-fila">' +
                        '<div class="col-sm-12"><span class="mb-table-title float-left">Fecha de cotizaci&oacute;n</span>' +
                        '<span class="float-right">' +
                        cotizacion.fecha +
                        "</span></div>" +
                        "</div>" +
                        '<div class="row tfs-fila">' +
                        '<div class="col-sm-12"><span class="mb-table-title float-left">Modelo</span>' +
                        '<span class="float-right">' +
                        cotizacion.modelo +
                        "</span></div>" +
                        "</div>" +
                        '<div class="row">' +
                        '<div class="col-sm-12 mb-table-title mb-table-link text-center">' +
                        '<a class="' +
                        cotizacion.clickeable +
                        '" style="color:red" href="/tfsm/my-tfsm/solicitud-digital?lead=' +
                        cotizacion.id +
                        '">' +
                        cotizacion.etapa +
                        '</a>' +
                        "</div>" +
                        "</div>" +
                        "</div>";
                    nroPdf++;
                });



                $("#cotizaciones").append(tableCotizacionesHTML);
                $("#cotizaciones_table").append(trCotizacionesHTML);
                $("#cotizaciones_table").append(closeTableCotizacionesHTML);
                $("#mis-cotizaciones").append(tableCotizacionesMobileHTML);
            }

            //
            $(".eliminarCotizacion").click(function () {
                sessionStorage.setItem("leadId", this.dataset.lead);
            });

            $(".pdf").click(function (e) {
                $.when(getFormValues(e.target.id))
                    .then(() => cotizar());
            })


            function getFormValues(idPdf) {
                form = {
                    Nombre: data.cotizaciones[idPdf].nombre,
                    Apellido: data.cotizaciones[idPdf].apellido,
                    emailCliente: data.cotizaciones[idPdf].email,
                    Telefono: "",
                    Marca: data.cotizaciones[idPdf].vehiculo,
                    autoId: "",
                    ImagenAuto: "",
                    ImagenModelo: "",
                    Vesion: data.cotizaciones[idPdf].modelo,
                    Anio: data.cotizaciones[idPdf].version,
                    Modelo: data.cotizaciones[idPdf].version,
                    precioAuto: data.cotizaciones[idPdf].precioAuto,
                    EngancheDeposito: data.cotizaciones[idPdf].enganche,
                    TipoPersona: data.cotizaciones[idPdf].tipoPersona,
                    Estado: data.cotizaciones[idPdf].estado,
                    Aseguradora: data.cotizaciones[idPdf].aseguradora,
                    Cobertura: data.cotizaciones[idPdf].cobertura,
                    PlanCotizar: data.cotizaciones[idPdf].plan === "TRADICIONAL" ? "Tradicional" : data.cotizaciones[idPdf].plan === "BALLOON" ? "Balloon" : data.cotizaciones[idPdf].plan === "ANUALIDADES" ? "Anualidades" : data.cotizaciones[idPdf].plan,
                    Plazo: data.cotizaciones[idPdf].plazo,
                    TipoUso: "Depósitos de Garantía",
                    CantidadDepositosGarantia: data.cotizaciones[idPdf].depositoGarantia,
                    precioAuto: parseInt(data.cotizaciones[idPdf].precioAuto).toString(),
                }
                fechaCotizacion = data.cotizaciones[idPdf].fecha;
                imagenAuto = data.cotizaciones[idPdf].ImagenAuto;
            }


            //Procesos de crédito activos.
            var noProcesosHTML = "";
            var con_proceso_msj = "";
            var trProcesosHTML = "";
            var tableProcesosHTML = "";
            var closeTableProcesosHTML = "";
            var tableProcesosMobileHTML = "";
            var solicitud_read_only = "";
            noProcesosHTML +=
                '<div class="col-md-12 cotizaciones-row p-5 my-5">' +
                '<h3 class="cotizaciones-card-title">Procesos de cr&eacute;dito activos</h3>' +
                '<div id="sin-cotizaciones"><div class="row mt-5">' +
                '<div class="col-md-5 text-right"><img src="/images/default-source/tfsm/my-tfsm/sin-cotizaciones.png" class="img-fluid" /></div>' +
                '<div class="col-md-5"><p class="table-text">A&uacute;n no tienes un proceso de cr&eacute;dito, ' +
                'no dejes pasar m&aacute;s tiempo e <a href="/cotizador">inicia una cotizaci&oacute;n</a>.' +
                "</div></div></div></div>";

            if (data.solicitudes.length == 0) {
                $("#procesos").append(noProcesosHTML);

                // Mensaje Sin Procesos de Crédito Activos:
                sin_procesos_msj +=
                    '<div class="row mt-5">' +
                    '<img class="img-fluid" src="/images/default-source/tfsm/my-tfsm/sin-procesos-activos" /><p class="ml-3 sin-procesos">' +
                    "A&uacute;n no tienes un proceso de cr&eacute;dito activo</p></div></div></div>";

                $("#dashboard-msj").append(sin_procesos_msj);
            } else {
                //CREACIÓN DE LA TABLA PROCESOS DE CRÉDITO ACTIVOS.
                tableProcesosHTML +=
                    '<div class="col-md-12 cotizaciones-row p-5 my-2">' +
                    '<h3 class="cotizaciones-card-title">Procesos de cr&eacute;dito activos</h3><div id="mis-procesos"></div>' +
                    '<table id="procesos_table" class="table cotizaciones-table mt-5 d-none d-md-table" id="con-cotizaciones mt-5"><thead>' +
                    '<tr><th scope="col">Veh&iacute;culo</th>' +
                    '<th scope="col">Versi&oacute;n</th>' +
                    '<th scope="col">Modelo</th><th scope="col">Distribuidor</th>' +
                    '<th scope="col"></th></tr></thead><tbody>';

                $.each(data.solicitudes, function (s, solicitud) {
                    trProcesosHTML +=
                        "<tr><td>" +
                        solicitud.vehiculo +
                        "</td><td>" +
                        solicitud.version +
                        "</td><td>" +
                        solicitud.modelo +
                        "</td><td>" +
                        solicitud.distribuidor +
                        "</td><td>" +
                        solicitud.etapa +
                        "</td></tr>";
                });

                closeTableProcesosHTML +=
                    "</tbody></table></div></div><div id='solicitud-readonly'></div>";

                //MOBILE
                $.each(data.solicitudes, function (s, solicitud) {
                    tableProcesosMobileHTML +=
                        '<div class="container d-block d-md-none card pb-4">' +
                        '<div class="row tfs-fila">' +
                        '<div class="col-sm-12"><span class="mb-table-title float-left">Veh&iacute;culo</span>' +
                        '<span class="float-right">' +
                        solicitud.vehiculo +
                        "</span></div>" +
                        "</div>" +
                        '<div class="row tfs-fila">' +
                        '<div class="col-sm-12"><span class="mb-table-title float-left">Versi&oacute;n</span>' +
                        '<span class="float-right">' +
                        solicitud.version +
                        "</span></div>" +
                        "</div>" +
                        '<div class="row tfs-fila">' +
                        '<div class="col-sm-12"><span class="mb-table-title float-left">Modelo</span>' +
                        '<span class="float-right">' +
                        solicitud.modelo +
                        "</span></div>" +
                        "</div>" +
                        '<div class="row tfs-fila">' +
                        '<div class="col-sm-12"><span class="mb-table-title float-left">Distribuidor</span>' +
                        '<span class="float-right">' +
                        solicitud.distribuidor +
                        "</span></div>" +
                        "</div>" +
                        '<div class="row">' +
                        '<div class="col-sm-12 mb-table-title text-center">' +
                        solicitud.etapa +
                        "</div>" +
                        "</div>" +
                        "</div>";
                });

                $("#procesos").append(tableProcesosHTML);
                $("#procesos_table").append(trProcesosHTML);
                $("#procesos_table").append(closeTableProcesosHTML);
                $("#mis-procesos").append(tableProcesosMobileHTML);

                //$(".false").css("text-decoration", "line-through");

                //ESTATUS DE PROCESO DE CRÉDITO (último realizado)

                // "Tienes un proceso de crédito activo. Podrás iniciar otro proceso hasta concluirlo."
                solicitud_read_only +=
                    '<div class="row mt-5 mx-1">' +
                    '<img class="img-fluid" src="/images/default-source/tfsm/my-tfsm/proceso-activo.png" />' +
                    '<span class="ml-3 sin-procesos text-center">Tienes un proceso de cr&eacute;dito activo. Podr&aacute;s iniciar otro proceso hasta concluirlo.' +
                    "</span></div>";

                switch (data.solicitudes[data.solicitudes.length - 1].etapa) {
                    case "Solicitud Incompleta":
                        //document.getElementById("recibida").classList.add("active-red");
                        //Mensaje de proceso activo:

                        //Con un proceso activo:
                        /* con_proceso_msj += '<div class="row mt-5">' + 
                                          '<img class="img-fluid" src="https://tfs-sitefinity.virtualdreams.io/images/default-source/tfsm/my-tfsm/sin-procesos-activos" /><p class="ml-3 sin-procesos">' + 
                                          'Hemos recibido tu solicitud de crédito. Ingresa <a class="proceso-activo-a" href="https://tfs-sitefinity.virtualdreams.io/tfsm/my-tfsm/solicitud-digital?lead=' + 
                                          data.solicitudes[data.solicitudes.length - 1].parentId + '&token=' + url.searchParams.get("token") + '">aquí</a> para verla.</p></div></div></div>'; */

                        con_proceso_msj +=
                            '<div class="d-flex mt-5 mx-1">' +
                            '<img class="img-pesos" src="/images/default-source/tfsm/my-tfsm/sin-procesos-activos" /><p class="w-80 sin-procesos text-center">' +
                            data.solicitudes[data.solicitudes.length - 1].etapa +
                            '. Ingresa <a class="proceso-activo-a" href="/tfsm/my-tfsm/solicitud-digital?lead=' +
                            data.solicitudes[data.solicitudes.length - 1].parentId +
                            "&token=" +
                            url.searchParams.get("token") +
                            '">aqu&iacute;</a> para completarla y dar un paso m&aacute;s para estrenar el Toyota de tus sue&ntilde;os.</p></div></div></div>';

                        $("#dashboard-msj").append(con_proceso_msj);
                        //Inserta el msje de validación
                        //$("#solicitud-readonly").append(solicitud_read_only);
                        break;
                    case "Enviada":
                        //document.getElementById("recibida").classList.add("active-red");
                        //document.getElementById("condicionada").classList.add("active-red");
                        //document.getElementById("aprobada").classList.add("active-red");
                        break;
                }
            }
            }
        },

        error: (err) => console.log(err),
        //url:window.config.urlbase + '/coti',
        url: window.config.urlToyotaCotizaciones + "/services/apexrest/sitefinity",
    };

    try {
        $.when(getToken())
            .then(
        $.ajax(settings))
    } catch (e) {
        console.log(e);
        return e;
    }

    $("#eliminarCotizacionesModalClose").click(function () {
        closeModal(`${this.dataset.modal}Modal`);
    });

    function cotizar() {

        $.ajax({
            type: 'POST',
            url: window.config.urlbase + '/PostCotizacion',
            data: form,
            //beforeSend: showLoader,
            //complete: hideLoader,
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
                        cotizaciones2 = result.data.Prices;
                        oksales = 1;
                        //showResults(result.data.Prices);
                        //commitSalesforce();

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
                    text: "Ocurrió un error al procesar la información",
                    icon: "error",
                    confirmButtonColor: "#cc0000",
                    timer: 5000
                });
                console.log(err);
            }
        }).then(function () {
            if (oksales == 1)
                downloadPdf();
            oksales = 0;
        });
    }

    //Se agrega esta funcion para la conversion a base64
    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    function downloadPdf() {

        // Se utiliza la variable imageInBase64 (el string de la imagen en base64)
        toDataURL(window.config.origin + '/' + imagenAuto, function (imageInBase64) {

            let data = {
                DatosCotizar: cotizaciones2,
                Plazo: form.Plazo,
                //ImagenAuto: window.config.origin + '/' + imagenAuto,
                ImagenAuto: imageInBase64,
                //ImagenModelo: form.ImagenModelo ? window.config.origin + '/' + form.ImagenModelo : form.ImagenModelo,
                PrecioAuto: form.precioAuto,
                FechaCotizacion: fechaCotizacion,
            };

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

    //Elimina cotizaciones.
    $("#cotizacionModalDelete").click(function () {
        var _paramLeadId = sessionStorage.getItem("leadId");
        var _paramTokenForLead = sessionStorage.getItem("token");
        let _dataForLead = {
            leadId: _paramLeadId,
        };

        let _myHeaderForLead = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + _paramTokenForLead,
            "Access-Control-Allow-Credentials": true,
        };

        const settingsForLead = {
            url:
                window.config.urlToyotaCotizaciones + "/services/apexrest/sitefinity",
            method: "PUT",
            headers: _myHeaderForLead,
            data: JSON.stringify(_dataForLead),
            success: (data) => {
                console.log(data);
                console.log(_dataForLead);
                window.location.reload();
            },
            error: (data) => {
                console.log(data);
            },
        };

        try {
            $.ajax(settingsForLead);
        } catch (e) {
            console.log(e);
            return e;
        }
    });

    //Para form de persona moral

    FloatLabel.init();

    $("#step-5-contact-form").validate({
        rules: {
            distribuidores: {
                selectRequired: true
            },
            phone: {
                required: true,
                minlength: 10,
                maxlength: 10
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

    /*$("#step-5-contact").click(function () {
        $("#step-5-contact-form").valid();
    });

    $("#step-5-contact").click(() => {
        commitSalesforcePlan();
    });*/

    $("#step-5-contact").click(function (e) {
        e.preventDefault();
        if ($("#step-5-contact-form").valid()) {
                commitSalesforcePlan();
        }else {
            console.log("formulario inválido");
        }
    }); 
            
});

function planSubmitClick() {
        $("#step-5-contact-form").submit();
    }

function commitSalesforcePlan() {
    var data = {
        Movil: $("#step-5-phone").val(),
        Email: sessionStorage.getItem("email"),
        Nombre: sessionStorage.getItem("name"),
        Apellido: sessionStorage.getItem("lastname"),
        AceptoTerminosYCondiciones: "SiAcepto",
        Marca: $("#vehicle option:selected").html(),
        Ballon: "text_ballon",
        Aseguradora: $("#distributor option:selected").html(),
        CodigoDistribuidor: $("#step-5-distribuidores").select2('data')[0].codigo,
    };
    console.log(data);
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

