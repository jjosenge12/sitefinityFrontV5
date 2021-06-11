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
    });

    $("#c-form").submit(function (e) {
        var pass = document.getElementById("passClientVisible").value;
        var user = document.getElementById("clientVisible").value;
        var fail = document.getElementById("failClient").value;
        var ok = document.getElementById("okClient").value;
        var pass_enc = window.btoa(pass);
        var user_enc = window.btoa(user);
        var fail_enc = window.btoa(fail);
        var ok_enc = window.btoa(ok);
        document.getElementById("passClient").value = pass_enc;
        document.getElementById("client").value = user_enc;
        document.getElementById("failClient").value = fail_enc;
        document.getElementById("okClient").value = ok_enc;
    });

    $("#registro-nc-form").submit(function (e) {
        encrypt_reg(false);
    });

    $("#registro-c-form").submit(function (e) {
        encrypt_reg(true);
    });

    function encrypt_reg(isClient) {

        if (isClient) {
            var clientId = document.getElementById("clientVisible").value;
            var clientId_enc = window.btoa(clientId);
            document.getElementById("client").value = clientId_enc;
        }
        else {
            var name = document.getElementById("nameVisible").value;
            var lastname = document.getElementById("lastnameVisible").value;

            var name_enc = window.btoa(name);
            var lastname_enc = window.btoa(lastname);

            document.getElementById("name").value = name_enc;
            document.getElementById("lastname").value = lastname_enc;
        }

        var rfc = document.getElementById("rfcVisible").value;
        var email = document.getElementById("emailVisible").value;
        var fail = document.getElementById("fail").value;
        var ok = document.getElementById("ok").value;
        var rfc_enc = window.btoa(rfc);
        var email_enc = window.btoa(email);
        var fail_enc = window.btoa(fail);
        var ok_enc = window.btoa(ok);
        document.getElementById("rfc").value = rfc_enc;
        document.getElementById("email").value = email_enc;
        document.getElementById("fail").value = fail_enc;
        document.getElementById("ok").value = ok_enc;
        //alert(pass_enc);
    }

    function encrypt(name) {
        var pass = document.getElementById("passVisible").value;
        var user = document.getElementById(`${name}Visible`).value;
        var fail = document.getElementById("fail").value;
        var ok = document.getElementById("ok").value;
        var pass_enc = window.btoa(pass);
        var user_enc = window.btoa(user);
        var fail_enc = window.btoa(fail);
        var ok_enc = window.btoa(ok);
        document.getElementById("pass").value = pass_enc;
        document.getElementById(name).value = user_enc;
        document.getElementById("fail").value = fail_enc;
        document.getElementById("ok").value = ok_enc;
        //alert(pass_enc);
    }

    const swiper = new Swiper('.swiper-container', {
        speed: 400,
        allowTouchMove: false,
        //initialSlide: 1
    });

    $("#ingreso-no-clientes").click(() => swiper.slideNext());
    $("#ingreso-clientes").click(() => swiper.slideTo(0));
    $("#volver-c").click(() => swiper.slideTo(1));
    $("#volver-nc").click(() => swiper.slideTo(1));
});