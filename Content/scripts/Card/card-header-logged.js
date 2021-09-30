let isLogged = sessionStorage.getItem("isLogged");

if (isLogged !== "true" && !window.location.href.includes("Sitefinity/adminapp")) {
  window.location.replace(window.location.origin + "/tfsm/home-delivery");
}

$(document).ready(function () {
    let username = sessionStorage.getItem("name"), isClient = sessionStorage.getItem("isClient");
    $(".user-name").html(username || "Usuario");
    if (isClient === 'true') {
        //$("#link-portal").show();
        $("link-portal-nav").html(`<a id="link-portal" target="_blank" href="${window.config.urlMyTfsm}" class="linkFinanciamiento">My TFS</a>`);
    }
    else {
        //$("#link-portal").hide();
    }

    $("#logout").click(function () {
        sessionStorage.clear();
        window.location.replace(window.location.origin + "/tfsm/home-delivery");
    });
});