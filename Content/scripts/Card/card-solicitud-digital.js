var url_string = window.location.href;
var url = new URL(url_string);
//var c = url.searchParams.get("email");
var token = url.searchParams.get("token");
var lead = url.searchParams.get("lead");
/* if(c!='' && c!=null && c!=undefined)
    c=atob(c); */
if (token != '' && token != null && token != undefined)
    token = atob(token);

document.onreadystatechange = function () {
    showLoader();
}

$(document).ready(function () {
    $Lightning.use("c:pruebita3", () => {
        $Lightning.createComponent("c:frontofficeSolicitudDigital", { "lead": lead, "backUrl": "https://tfs-sitefinity.virtualdreams.io/tfsm/mis-cotizaciones" }, "lightning", () => { console.log("YA SE CREO EL COMPONENTE"); hideLoader(); });
    },
        "https://toyotafinancial--salt001.lightning.force.com", token
    );                        

});
