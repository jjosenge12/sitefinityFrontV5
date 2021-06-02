$(document).ready(function () {
    //let bloqueVariable = document.getElementById("variable");
    //bloqueVariable.innerHTML = document.getElementById("bienvenida").innerHTML;
    var noCliente = document.getElementById("ingreso-no-clientes");
    var volver = document.getElementById("volver");

    function changeBienvenida() {
        //bloqueVariable.innerHTML = document.getElementById("iniciar-sesion").innerHTML;
        $("#bienvenida").hide('slide', {direction: 'left'});
        $("#iniciar-sesion").show('slide', { direction: 'left' });
    };
    function changeInicioDeSesion() {
        //bloqueVariable.innerHTML = document.getElementById("bienvenida").innerHTML;
        $("#iniciar-sesion").hide();
        $("#bienvenida").show();
    };

    //function encrypt() {
    //    var pass = document.getElementById("pass").value;
    //    var user = document.getElementById("user").value;
    //    var pass_enc = window.btoa(pass);
    //    var user_enc = window.btoa(user);
    //    document.getElementById("passwordHidden").value = pass_enc;
    //    document.getElementById("userHidden").value = user_enc;
    //}

    const swiper = new Swiper('.swiper-container', {
        speed: 400,
        allowTouchMove: false
    });

    $("#ingreso-no-clientes").click(() => swiper.slideNext());
    $("#volver").click(() => swiper.slidePrev());
});