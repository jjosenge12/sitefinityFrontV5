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
    initMap();
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

$(document).ready(function () {
    $(".browser-tab").click(function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        console.log($(this));
        var tab = $(this)[0].dataset["tab"];

        var panel = $(`.tab-panel[data-tab-panel=${tab}]`)[0];
        $(panel).show();
        $(panel).siblings().hide();
    });

    $("#state").select2({
        dropdownParent: $("#state").parent()
    });

    $("select").on("select2:open", function () {
        $(this).siblings("[class='focus-border']").addClass("active");
    });

    $("select").on("select2:close", function () {
        $(this).siblings("[class='focus-border active']").removeClass("active");
    });
});
