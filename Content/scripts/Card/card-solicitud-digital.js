var url_string = window.location.href;
var url = new URL(url_string);

var token = sessionStorage.getItem("token");
var lead = url.searchParams.get("lead");
var path = window.location.pathname.split('/');

$(document).ready(function () {

    if (path[1] != "Sitefinity") {
        if (lead === '' || lead === null || lead === undefined) {
            Swal.fire({
                title: "Selección Inválida",
                text: "Por favor seleccione una cotización en la tabla de cotizaciones",
                icon: "error",
                confirmButtonColor: "#cc0000"
            })
                .then(() => {
                    window.location.replace(window.config.origin + "/tfsm/mis-cotizaciones");
                })
        }
        else {
            $("#loading-page").show();
            $Lightning.use("c:solicitudDigitalEmbebed", () => {
                $Lightning.createComponent("c:frontofficeSolicitudDigital", { "lead": lead, "backUrl": window.config.origin + "/tfsm/mis-cotizaciones" }, "lightning", () => { console.log("YA SE CREO EL COMPONENTE"); $("#loading-page").hide(); });
            },
                "https://toyotafinancial--salt001.lightning.force.com", token
            );
        }
    }

});
