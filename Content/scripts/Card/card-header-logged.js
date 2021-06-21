let isLogged = sessionStorage.getItem("isLogged");

if(isLogged !== "true"){
  window.location.replace(window.location.origin + "/tfsm/my-tfsm/login-clientes");
}

$(document).ready(function () {
    $("#user-name").html(sessionStorage.getItem("name"));
});