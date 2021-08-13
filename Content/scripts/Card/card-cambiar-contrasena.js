var token = "";

$(document).ready(function () {
    $.ajax(window.config.urlbase + "/GetAccessToken", {
        beforeSend: showLoader,
        complete: hideLoader,
        success: function (data) {
            token = data.result;
        }
    });

    $("#cambiar-pass-form").submit(function (event) {
        event.preventDefault();

        var header = {
            "Authorization": "Bearer " + token,
            "Access-Control-Allow-Origin": "*"
        };

        var body = {
            "rfc": $("#rfc").val(),
            "password": $("#password").val()
        };

        $.ajax(window.config.UrlMySalesforce + '/services/apexrest/SetPasswordSitefinity', {
            beforeSend: showLoader,
            complete: hideLoader,
            method: 'post',
            header: header,
            data: body,
            success: function (res) {
                console.log(res);
            }
        });
    });
});