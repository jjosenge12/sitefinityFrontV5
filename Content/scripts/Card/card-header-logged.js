let isLogged = sessionStorage.getItem("isLogged");

if (isLogged !== "true") {
  //window.location.replace(window.location.origin + "/tfsm/my-tfsm/login-clientes");
}

$(document).ready(function () {
    let username = sessionStorage.getItem("name");
    if (username) {
        $(".user-name").html(username);
    }
    else {
        $(".user-name").html("Usuario");
    }

    $("#logout").click(function () {
        sessionStorage.clear();
        window.location.replace(window.location.origin + "/tfsm/my-tfsm");
    });
});