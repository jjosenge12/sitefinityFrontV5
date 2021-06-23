var url_string = window.location.href;
var url = new URL(url_string);

var token = sessionStorage.getItem("token");
var lead = url.searchParams.get("lead");

if (lead === '' && lead === null && lead === undefined) {
    Swal.fire({
        title: "Selección Inválida",
        text: "Por favor seleccione una cotización en la tabla de cotizaciones",
        icon: "error",
        confirmButtonColor: "#cc0000"
    })
        .then(() => {
            window.location.replace(window.location.origin + "/tfsm/mis-cotizaciones");
        })
}

$(document).ready(function () {
    showLoader();
    $Lightning.use("c:pruebita3", () => {
        $Lightning.createComponent("c:frontofficeSolicitudDigital", { "lead": lead, "backUrl": "https://tfs-sitefinity.virtualdreams.io/tfsm/mis-cotizaciones" }, "lightning", () => { console.log("YA SE CREO EL COMPONENTE"); hideLoader(); });
    },
        "https://toyotafinancial--salt001.lightning.force.com", token
    );                        

});
