let isLogged = sessionStorage.getItem("isLogged");

grecaptcha.ready(async function () {
    // do request for recaptcha token
    // response is promise with passed token
    let recaptchaSiteKey;
    console.log("Invocando recaptcha");
    //console.log("Valor anterior:" + window.config.reCaptchaSiteKey);
    await $.ajax({
        type: "get",
        url: window.config.urlbase + "/recaptchaSiteKey",
        datatype: "json",
        success: function (data) {
            recaptchaSiteKey = data;
            //console.log("La clave recaptchaSiteKey es:", recaptchaSiteKey);
        },
    });
    grecaptcha.execute(recaptchaSiteKey, { action: 'validate_captcha' })
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