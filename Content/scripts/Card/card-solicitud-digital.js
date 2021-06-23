var url_string = window.location.href;
var url = new URL(url_string);

var token = sessionStorage.getItem("token");
var lead = url.searchParams.get("lead");

//if (token != '' && token != null && token != undefined)
//    token = atob(token);

$(document).ready(function () {
    showLoader();
    $Lightning.use("c:pruebita3", () => {
        $Lightning.createComponent("c:frontofficeSolicitudDigital", { "lead": lead, "backUrl": "https://tfs-sitefinity.virtualdreams.io/tfsm/mis-cotizaciones" }, "lightning", () => { console.log("YA SE CREO EL COMPONENTE"); hideLoader(); });
    },
        "https://toyotafinancial--salt001.lightning.force.com", token
    );                        

});
