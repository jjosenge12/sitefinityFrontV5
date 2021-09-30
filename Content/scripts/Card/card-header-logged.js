let isLogged = sessionStorage.getItem("isLogged");

if (isLogged !== "true" && !window.location.href.includes("Sitefinity/adminapp")) {
  window.location.replace(window.location.origin + "/tfsm/home-delivery");
}

$(document).ready(function () {
    let username = sessionStorage.getItem("name"), isClient = sessionStorage.getItem("isClient");
    $(".user-name").html(username || "Usuario");
    console.log(isClient);
    if (isClient === "true") {
        $("#link-portal").css("display", "block");
    }
    else {
        $("#link-portal").css("display", "none");
    }

    $("#logout").click(function () {
        sessionStorage.clear();
        window.location.replace(window.location.origin + "/tfsm/home-delivery");
    });
});