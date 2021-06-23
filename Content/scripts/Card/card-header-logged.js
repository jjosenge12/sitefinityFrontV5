let isLogged = sessionStorage.getItem("isLogged");

if (isLogged !== "true" && !window.location.href.includes("Sitefinity/adminapp")) {
  window.location.replace(window.location.origin + "/tfsm/my-tfsm/login-clientes");
}

$(document).ready(function () {
    let username = sessionStorage.getItem("name"), isClient = sessionStorage.getItem("isClient");
    $(".user-name").html(username || "Usuario");
    $("#link-portal").css("display", isClient === "true" ? "block" : "none");
    //if (username) {
    //    $(".user-name").html(username);
    //}
    //else {
    //    $(".user-name").html("Usuario");
    //}

    $("#logout").click(function () {
        let url, session = sessionStorage.getItem("isClient");
        if (session === "true") {
            url = window.location.origin + "/tfsm/my-tfsm/login-clientes";
        }
        else {
            url = window.location.origin + "/tfsm/my-tfsm";
        }
        sessionStorage.clear();
        window.location.replace(url);
    });
});