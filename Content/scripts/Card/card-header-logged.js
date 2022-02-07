let isLogged = sessionStorage.getItem("isLogged");

grecaptcha.ready(function () {
    // do request for recaptcha token
    // response is promise with passed token
    grecaptcha.execute(window.config.reCaptchaSiteKey, { action: 'validate_captcha' })
        .then(function (token) {
            // add token value to form
            recaptchaToken = token;
        });
});

$(document).ready(function () {
    if (isLogged !== "true" && !window.location.href.includes("Sitefinity/adminapp")) {
        window.location.replace(window.location.origin + "/tfsm/home-delivery");
    }
    let username = sessionStorage.getItem("name"), isClient = sessionStorage.getItem("isClient");
    $(".user-name").html(username || "Usuario");
    if (isClient === 'true') {
        //$("#link-portal-nav").html(`<a id="link-portal" target="_blank" href="${window.config.urlMyTfsm}" class="linkFinanciamiento">My TFS</a>`);
        $("#link-portal").css("display", isClient === 'true' ? "block" : "none");
    }

    if (window.location.href.includes("/tfsm/mis-cotizaciones")) {
        $("#link-portal").hide();
    }

    $("#logout").click(function () {
        sessionStorage.clear();
        window.location.replace(window.location.origin + "/tfsm/home-delivery");
    });
});