let isLogged = sessionStorage.getItem("isLogged");


$(document).ready(function () {
    if (isLogged !== "true" && !window.location.href.includes("Sitefinity/adminapp")) {
        window.location.replace(window.location.origin + "/tfsm/home-delivery");
    }
    let username = sessionStorage.getItem("name"), isClient = sessionStorage.getItem("isClient");
    $(".user-name").html(username || "Usuario");
    if (isClient === 'true') {
        $("#link-portal-nav").html(`<a id="link-portal" target="_blank" href="${window.config.urlMyTfsm}" class="linkFinanciamiento">My TFS</a>`);
    }

    $("#logout").click(function () {
        sessionStorage.clear();
        window.location.replace(window.location.origin + "/tfsm/home-delivery");
    });
});