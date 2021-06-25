let isLogged = sessionStorage.getItem("isLogged");

if (isLogged !== "true" && !window.location.href.includes("Sitefinity/adminapp")) {
  window.location.replace(window.location.origin + "/tfsm/home-delivery");
}

$(document).ready(function () {
    let username = sessionStorage.getItem("name"), isClient = sessionStorage.getItem("isClient");
    $(".user-name").html(username || "Usuario");
    $("#link-portal").css("display", isClient === "true" ? "block" : "none");

    $("#logout").click(function () {
        sessionStorage.clear();
        window.location.replace(window.location.origin + "/tfsm/home-delivery");
    });
});