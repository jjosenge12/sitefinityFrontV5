var eliminarCotizacionModal = "eliminarCotizacionModal";

function capitalize(str) {
    return str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
}

$(document).ready(() => {
    /* Se obtienen los valores de los parámetros 
                email y token que llegan en la url 
                para hacer el request. */
    var url_string = window.location.href;
    var url = new URL(url_string);
    // var _paramEmail = url.searchParams.get("email");
    // var _paramToken = url.searchParams.get("token");
    var _paramEmail = sessionStorage.getItem("email");
    var _paramToken = sessionStorage.getItem("token");

    let _data = {
        email: _paramEmail,
    };

    let _myHeader = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + _paramToken,
        "Access-Control-Allow-Credentials": true,
    };

    const settings = {
        method: "POST",
        headers: _myHeader,
        data: JSON.stringify(_data),
        success: (data) => {
            console.log(data);

            //Sección de Bienvenida Home Delivery
            var bannerBienvenida = "";
            var nombre = data.esCliente[0].nombre,
                apellido = data.esCliente[0].apellido,
                isClient = data.esCliente[0].esCliente;
            sessionStorage.setItem("name", capitalize(nombre));
            sessionStorage.setItem("lastname", capitalize(apellido));
            sessionStorage.setItem("isClient", isClient);
            $(".user-name").html(capitalize(nombre));
            //$("#link-portal").css("display", isClient === 'true' ? "block" : "none");

            bannerBienvenida +=
                '<div class="col-md-1"></div><div class="col-md-7 mt-5">' +
                '<h1 class="cotizaciones-title">Hola ' +
                capitalize(nombre) +
                "<br />Nos da mucho gusto que quieras ser parte de la familia Toyota." +
                '</h1><p class="cotizaciones-p">Te presentamos tu tablero Home Delivery. ' +
                "En él podrás iniciar y darle seguimiento a tu proceso de financiamiento.</p></div>" +
                '<div class="col-md-3 mt-5 col d-flex align-items-center justify-content-center">' +
                '<img src="' + window.location.origin + '/images/default-source/tfsm/my-tfsm/logo-home-delivery-lg.png?Status=Master&sfvrsn=bebd466a_3/Logo-home-delivery-lg" class="img-fluid" />' +
                '</div><div class="col-md-1"></div>';

            $("#bannerBienvenida").append(bannerBienvenida);

            // Tablero Iniciar Cotización y Estatus de Procesos
            var dashboard = "";
            var sin_procesos_msj = "";
            dashboard +=
                '<div class="mt-5"><div class="col-md-6 p-5 cotizaciones-card">' +
                '<h3 class="cotizaciones-card-title">¡Hoy es el mejor día para iniciar ' +
                'tu proceso de crédito para Estrenar un Toyota!</h3><a href="/cotizador" class="btn cotizacion-btn mt-5">' +
                'iniciar cotización</a></div><div class="col-md-6 p-5 cotizaciones-card">' +
                '<h3 class="cotizaciones-card-title">Estatus de tu proceso de crédito</h3>' +
                '<div id="dashboard-msj"></div>';
            /*'<div class="row text-center mt-5"><div class="col-md-4"><hr class="status" id="recibida" />' + 
                        '<p class="status-p">Solicitud recibida</p></div><div class="col-md-4"> <hr class="status" id="condicionada" />' + 
                        '<p class="status-p">Solicitud condicionada</p></div><div class="col-md-4"><hr class="status" id="aprobada" />' + 
                        '<p class="status-p">Solicitud aprobada</p></div></div><div id="dashboard-msj"></div>'; */

            $("#dashboard").append(dashboard);

            var noCotizacionesHTML = "";
            var trCotizacionesHTML = "";
            var tableCotizacionesHTML = "";
            var closeTableCotizacionesHTML = "";
            noCotizacionesHTML +=
                '<div class="col-md-12 cotizaciones-row p-5 mt-5">' +
                '<h3 class="cotizaciones-card-title">Cotizaciones realizadas</h3>' +
                '<div id="sin-cotizaciones"><div class="row mt-5">' +
                '<div class="col-md-5 text-right"><img src="' + window.location.origin + '/images/default-source/tfsm/my-tfsm/sin-cotizaciones.png" class="img-fluid" /></div>' +
                '<div class="col-md-5"><p class="table-text">No has realizado cotizaciones.<br />' +
                'Para iniciar un proceso de financiamiento, es necesario <a href="#"> iniciar una cotización</a>.' +
                "</div></div></div>";

            if (data.cotizaciones.length <= 0) {
                $("#cotizaciones").append(noCotizacionesHTML);
            } else {
                //CREACIÓN DE LA TABLA DE COTIZACIONES
                tableCotizacionesHTML +=
                    '<div class="col-md-12 cotizaciones-row p-5 mt-2 mb-3">' +
                    '<h3 class="cotizaciones-card-title">Cotizaciones realizadas</h3>' +
                    '<table id="cotizaciones_table" class="table cotizaciones-table mt-5 d-none d-md-table" id="con-cotizaciones mt-5"><thead>' +
                    '<tr><th scope="col">Vehículo</th>' +
                    '<th scope="col">Versión</th><th scope="col">Fecha de cotización</th>' +
                    '<th scope="col">Modelo</th><th scope="col"></th></tr></thead><tbody>';

                $.each(data.cotizaciones, function (c, cotizacion) {
                    trCotizacionesHTML +=
                        "<tr><td>" +
                        cotizacion.vehiculo +
                        "</td><td>" +
                        cotizacion.version +
                        "</td><td>" +
                        cotizacion.fecha +
                        "</td><td>" +
                        cotizacion.modelo +
                        '</td><td><a href="' + window.location.origin + '/tfsm/home-delivery/solicitud-digital?lead=' +
                        cotizacion.id +
                        '">' +
                        cotizacion.etapa +
                        "</div></td>" +
                        '<td><img onclick="openModal(eliminarCotizacionModal)" id="eliminarCotizacion" src="' + window.location.origin + '/images/default-source/tfsm/my-tfsm/fi_x" style="cursor:pointer;" />' +
                        "</td></tr>";
                });

                closeTableCotizacionesHTML += "</tbody></table></div>";

                $("#cotizaciones").append(tableCotizacionesHTML);
                $("#cotizaciones_table").append(trCotizacionesHTML);
                $("#cotizaciones_table").append(closeTableCotizacionesHTML);
            }

            //Procesos de crédito activos.
            var noProcesosHTML = "";
            var con_proceso_msj = "";
            var trProcesosHTML = "";
            var tableProcesosHTML = "";
            var closeTableProcesosHTML = "";
            noProcesosHTML +=
                '<div class="col-md-12 cotizaciones-row p-5 my-5">' +
                '<h3 class="cotizaciones-card-title">Procesos de crédito activos</h3>' +
                '<div id="sin-cotizaciones"><div class="row mt-5">' +
                '<div class="col-md-5 text-right"><img src="' + window.location.origin + '/images/default-source/tfsm/my-tfsm/sin-cotizaciones.png" class="img-fluid" /></div>' +
                '<div class="col-md-5"><p class="table-text">Aún no tienes un proceso de crédito, ' +
                'no dejes pasar más tiempo e <a href="/cotizador">inicia una cotización</a>.' +
                "</div></div></div></div>";

            if (data.solicitudes.length == 0) {
                $("#procesos").append(noProcesosHTML);

                // Mensaje Sin Procesos de Crédito Activos:
                sin_procesos_msj +=
                    '<div class="row mt-5">' +
                    '<img class="img-fluid" src="' + window.location.origin + '/images/default-source/tfsm/my-tfsm/sin-procesos-activos" /><p class="ml-3 sin-procesos">' +
                    "Aún no tienes un proceso de crédito activo</p></div></div></div>";

                $("#dashboard-msj").append(sin_procesos_msj);
            } else {
                //CREACIÓN DE LA TABLA PROCESOS DE CRÉDITO ACTIVOS.
                tableProcesosHTML +=
                    '<div class="col-md-12 cotizaciones-row p-5 my-2">' +
                    '<h3 class="cotizaciones-card-title">Procesos de crédito activos</h3>' +
                    '<table id="procesos_table" class="table cotizaciones-table mt-5 d-none d-md-table" id="con-cotizaciones mt-5"><thead>' +
                    '<tr><th scope="col">Vehículo</th>' +
                    '<th scope="col">Versión</th>' +
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

                closeTableProcesosHTML += "</tbody></table></div>";

                $("#procesos").append(tableProcesosHTML);
                $("#procesos_table").append(trProcesosHTML);
                $("#procesos_table").append(closeTableProcesosHTML);

                //ESTATUS DE PROCESO DE CRÉDITO (último realizado)
                switch (data.solicitudes[data.solicitudes.length - 1].etapa) {
                    case "Completar solicitud":
                        //document.getElementById("recibida").classList.add("active-red");
                        //Mensaje de proceso activo:

                        //Con un proceso activo:
                        /* con_proceso_msj += '<div class="row mt-5">' + 
                                          '<img class="img-fluid" src="' + window.location.origin + '/images/default-source/tfsm/my-tfsm/sin-procesos-activos" /><p class="ml-3 sin-procesos">' + 
                                          'Hemos recibido tu solicitud de crédito. Ingresa <a class="proceso-activo-a" href="' + window.location.origin + '/tfsm/my-tfsm/solicitud-digital?lead=' + 
                                          data.solicitudes[data.solicitudes.length - 1].parentId + '&token=' + url.searchParams.get("token") + '">aquí</a> para verla.</p></div></div></div>'; */

                        con_proceso_msj +=
                            '<div class="row mt-5 mx-1">' +
                            '<img class="img-fluid" src="' + window.location.origin + '/images/default-source/tfsm/my-tfsm/sin-procesos-activos" /><p class="ml-3 sin-procesos text-center">' +
                            data.solicitudes[data.solicitudes.length - 1].etapa +
                            '. Ingresa <a class="proceso-activo-a" href="' + window.location.origin + '/tfsm/home-delivery/solicitud-digital?lead=' +
                            data.solicitudes[data.solicitudes.length - 1].parentId +
                            "&token=" +
                            url.searchParams.get("token") +
                            '">aquí</a> para verla.</p></div></div></div>';

                        $("#dashboard-msj").append(con_proceso_msj);

                        break;
                    case "Enviada":
                        //document.getElementById("recibida").classList.add("active-red");
                        //document.getElementById("condicionada").classList.add("active-red");
                        //document.getElementById("aprobada").classList.add("active-red");
                        break;
                }
            }
        },

        error: (err) => console.log(err),
        url: "https://toyotafinancial--salt001.my.salesforce.com/services/apexrest/sitefinity",
    };

    try {
        $.ajax(settings);
    } catch (e) {
        console.log(e);
        return e;
    }

    $("#eliminarCotizacionesModalClose").click(function () {
        closeModal(`${this.dataset.modal}Modal`);
    });
});
