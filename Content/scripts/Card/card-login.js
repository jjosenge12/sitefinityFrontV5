$(document).ready(function () {

    $(".sf-form-container").each(function () {
        var form = document.createElement("form");

        form.innerHTML = this.innerHTML;
        Object.keys(this.dataset).forEach((x) => {
            form[x] = this.dataset[x];
        });

        $(this).html(form);
        FloatLabel.init();
    });

    $("#nc-form").submit(function (e) {
        encrypt_nc();
    });

    $("#c-form").submit(function (e) {
        encrypt_c();
    });

    function encrypt_nc() {
        var pass = document.getElementById("passVisible").value;
        var user = document.getElementById("userVisible").value;
        var fail = document.getElementById("fail").value;
        var ok = document.getElementById("ok").value;
        var pass_enc = window.btoa(pass);
        var user_enc = window.btoa(user);
        var fail_enc = window.btoa(fail);
        var ok_enc = window.btoa(ok);
        document.getElementById("pass").value = pass_enc;
        document.getElementById("user").value = user_enc;
        document.getElementById("fail").value = fail_enc;
        document.getElementById("ok").value = ok_enc;
        //alert(pass_enc);
    }

    function encrypt_c() {
        var pass = document.getElementById("passVisible").value;
        var user = document.getElementById("clientVisible").value;
        var fail = document.getElementById("fail").value;
        var ok = document.getElementById("ok").value;
        var pass_enc = window.btoa(pass);
        var user_enc = window.btoa(user);
        var fail_enc = window.btoa(fail);
        var ok_enc = window.btoa(ok);
        document.getElementById("pass").value = pass_enc;
        document.getElementById("client").value = user_enc;
        document.getElementById("fail").value = fail_enc;
        document.getElementById("ok").value = ok_enc;
        //alert(pass_enc);
    }

    const swiper = new Swiper('.swiper-container', {
        speed: 400,
        allowTouchMove: false
    });

    $("#ingreso-no-clientes").click(() => swiper.slideNext());
    $("#volver").click(() => swiper.slidePrev());
});