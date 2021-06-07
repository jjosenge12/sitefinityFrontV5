// Note: This  requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

// Global variables
var map, infoWindow, geocoder, closestDistance = 50000, icon = '', arrMarkers = [];
var iconMyPosition = '../../../../../Mvc/Content/TFSM/Images/Distribuidores/Map-Marker-Azure.png';
var iconTFSM = '../../../../../Mvc/Content/TFSM/Images/Distribuidores/marker_map_travel_48.png';
var iconSelected = '../../../../../Mvc/Content/TFSM/Images/Distribuidores/map-marker-toyota-car.png';
var okImg = '../../../../../Mvc/Content/TFSM/Images/Paso0/ok.gif';
var errImg = '../../../../../Mvc/Content/TFSM/Images/Paso0/err.gif';
var warningImg = '../../../../../Mvc/Content/TFSM/Images/Paso0/alert.gif';
var dealerCode = 0;

$(document).ready(function () {
    //initMap();
    /*GetDDLEstados();*/

    //$('#ddlEstados').on('change', function () {
    //    var id = $(this).attr('value');
    //    if (parseInt(id) > 0) {
    //        if (parseInt(id) === 1000)
    //            initMap();
    //        else
    //            GetDealersByCountry(id);
    //    }
    //});
});

function initMap() {
    // Geolocation. Get Origin Point.
    //$('#Loader').modal('show');

    //infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = { lat: position.coords.latitude, lng: position.coords.longitude };
            // Initialize variables.
            map = new google.maps.Map(document.getElementById('map'), {
                center: pos,
                zoom: 10
            });

            /*getData(map, pos);*/
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function capitalize(str) {
    return str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
}

$(document).ready(function () {
    var select_validator = $("#state-select").validate({
        rules:
        {
            state: {
                selectRequired: true
            }
        }
    });
    var input_validator = $("#pc-input").validate({
        rules:
        {
            "postal-code": {
                required: true,
                isPostalCode: true
            }
        }
    });

    $(".browser-tab").click(function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        var tab = $(this)[0].dataset["tab"];

        var panel = $(`.tab-panel[data-tab-panel=${tab}]`)[0];
        $(panel).show();
        $(panel).siblings().hide();
    });

    let states = [];
    $.ajax({
        type: "get",
        url: window.config.urlbase + "/getcountrystates",
        datatype: "json",
        success: function (data) {
            data.results.forEach((x) => {
                let state = {
                    id: x.id_estado,
                    text: capitalize(x.descripcion),
                };

                states.push(state);
            });

            $("#state").select2({
                dropdownParent: $("#state").parent(),
                data: states,
            });

            $("select").on("select2:open", function () {
                $(this).siblings("[class='focus-border']").addClass("active");
            });

            $("select").on("select2:close", function () {
                $(this).siblings("[class='focus-border active']").removeClass("active");
            });

            $("select").on("select2:select", function () {
                select_validator.element("#state");
            });
        },
    });

    $("#search-dealers-pc").click(function () {
        $("#results-list").html("");
        if ($("#pc-input").valid()) {
            hideBrowser(this, 1);
            $("#dealer-results").show();
            getDealersByPostalCode($("#postal-code").val());
        }
    });

    $("#refresh-search-pc").click(function () {

        if ($("#pc-input").valid()) {
            $("#results-list").html("");
            getDealersByPostalCode($("#postal-code").val());
        }
    });

    $("#search-dealers-state").click(function () {

        $("#results-list").html("");
        if ($("#state-select").valid()) {
            hideBrowser(this, 2);
            $("#dealer-results").show();
            getDealersByState($("#state").val());
        }

    });

    $("#refresh-search-select").click(function () {

        if ($("#state-select").valid()) {
            $("#results-list").html("");
            getDealersByState($("#state").val());
        }
    });

    $("#back-button").click(function () {
        showBrowser();
    });

});

function hideBrowser(btn, type) {
    $("#dealers-title").slideUp(400, () => $("#browser-title").show());
    $("#tabs").slideUp(400);
    $("#browser").addClass('results');
    $(btn).parent().hide('fade', 400, () => $("#dealer-results").show());

    if (type === 1) {
        $(".browser-input").addClass('results');
        setTimeout(() => $("#refresh-search-pc").show(), 400);
    }
    else {
        $(".state-container").addClass('results');
        setTimeout(() => $("#refresh-search-select").show(), 400);
    }
}

function showBrowser() {
    $("#browser-title").hide(0, () => $("#dealers-title").slideDown(400));
    $("#tabs").show();
    $("#browser").removeClass('results');
    $("#dealer-results").hide('fade', 400, () => $(".browser-actions").show('fade', 400));
    $("#refresh-search-pc").hide(() => $(".browser-input").removeClass('results'));
    $("#refresh-search-select").hide(() => $(".state-container").removeClass('results'));
}

function getDealersByPostalCode(pc) {
    $.ajax({
        type: "get",
        beforeSend: () => $("#dealer-loader").show(),
        url: window.config.urlbase + "/getdealersbypostalcode?pc=" + pc,
        datatype: "json",
        success: function (data) {
            let dealers = document.createElement('div');
            data.results.forEach(function (x) {
                let card = document.createElement('div');
                let title = document.createElement('div');
                let address = document.createElement('div');
                console.log(x);
                card.classList.add("dealer-result");
                card.classList.add("ripple");
                title.classList.add("dealer-result-title");
                address.classList.add("dealer-result-address");

                title.innerHTML = capitalize(x.Dealer);
                address.innerHTML = x.Adress;
                card.append(title);
                card.append(address);

                dealers.append(card);
            });

            $("#dealer-loader").hide();
            $("#results-list").html(dealers.innerHTML);

            $(".dealer-result").click(function () {
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
            });
        },
        complete: () => $("#dealer-loader").hide()
    })
}

function getDealersByState(stateId) {
    $.ajax({
        type: "get",
        beforeSend: () => $("#dealer-loader").show(),
        url: window.config.urlbase + "/getdealersbystateid?stateId=" + stateId,
        datatype: "json",
        success: function (data) {
            let dealers = document.createElement('div');
            data.results.forEach(function (x) {
                let card = document.createElement('div');
                let title = document.createElement('div');
                let address = document.createElement('div');
                console.log(x);
                card.classList.add("dealer-result");
                card.classList.add("ripple");
                title.classList.add("dealer-result-title");
                address.classList.add("dealer-result-address");

                title.innerHTML = capitalize(x.Dealer);
                address.innerHTML = x.Adress;
                card.append(title);
                card.append(address);

                dealers.append(card);
            });

            $("#dealer-loader").hide();
            $("#results-list").html(dealers.innerHTML);

            $(".dealer-result").click(function () {
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
            });
        },
        complete: () => $("#dealer-loader").hide()
    })
}