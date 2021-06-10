// Note: This  requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

// Global variables
var map, infoWindow, geocoder, closestDistance = 50000, distanceMatrix, userPos;
var iconMyPosition = '../../Content/Images/Distribuidores/map-marker.svg';
var iconTFSM = '../../Content/Images/Distribuidores/marker_map_travel_48.png';
var iconSelected = '../../Content/Images/Distribuidores/map-marker-toyota-car.png';
var okImg = '../../Content/Images/Paso0/ok.gif';
var errImg = '../../Content/Images/Paso0/err.gif';
var warningImg = '../../Content/Images/Paso0/alert.gif';
var dealerCode = 0;
var dealers = [], lastMarker;
const apiKey = 'AIzaSyAXcPfvcjvg30JnlXggadE6_jbjnsQvCTw';

function CenterControl(controlDiv, map, myLoc) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '2px';
    controlUI.style.boxShadow = 'rgb(0 0 0 / 30%) 0px 1px 4px -1px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.style.width = '40px';
    controlUI.style.height = '40px';
    controlUI.style.display = 'flex';
    controlUI.style.alignItems = 'center';
    controlUI.style.justifyContent = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    var controlImg = document.createElement('img');
    //controlImg.src = '../Content/images/gps.png';
    controlImg.src = '../../Content/Images/Distribuidores/gps.png';
    controlImg.width = 20;
    controlUI.appendChild(controlImg);


    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function () {
        map.setZoom(15);
        map.setCenter(myLoc);
    });

}

function initMap() {

    infoWindow = new google.maps.InfoWindow;

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 21.914925, lng: -102.291311 },
        zoom: 10
    });

    var markers;
    $.ajax({
        type: "get",
        url: window.config.urlbase + "/getdealers",
        datatype: "json",
        success: function (data) {
            dealers = data.results;
            markers = data.results.map(function (dealer, i) {

                let marker = new google.maps.Marker({

                    position: { lat: Number(dealer.Lat), lng: Number(dealer.Lng) },
                    zIndex: google.maps.Marker.MAX_ZINDEX,
                    map: map,
                    icon: iconTFSM

                });

                var contentString = '';
                contentString += '<div class="container marker-popup" style="max-width:35rem;">';
                contentString += '<input type="hidden" id="dealerId" value="' + dealer.IdDealer + '"/>';
                contentString += '<div class="row">';
                contentString += '<div class="col-9 popup-left">';
                contentString += '<div><p class="popup-title">' + dealer.Dealer + '</p></div>';
                contentString += '<hr style="color:#ffffff; margin: 0.5rem 0;"/>';
                contentString += '<div><p class="adreess">' + dealer.Adress + '</p></div>';

                contentString += '<div class="col-sm-12 mt-4" style="display:flex; justify-content:center;">';
                contentString += '<button type="button" onclick="openModal(\'contactModal\')" class="btn-red">Contactar</button>';
                contentString += '</div>';

                contentString += '</div>';
                contentString += '<div class="col-3 popup-right" style="user-select:none;">';
                contentString += '<img src="../../Content/Images/Distribuidores/map-marker-tfsm.png" />';
                contentString += '</div>';

                contentString += '</div>';
                contentString += '</div>';

                marker.info = new google.maps.InfoWindow({

                    content: contentString
                });


                google.maps.event.addListener(marker, 'click', function () {

                    if (lastMarker) {

                        lastMarker.info.close();

                    }

                    marker.info.open(map, marker);

                    lastMarker = marker;
                    map.setZoom(15);
                    map.setCenter(marker.position);
                });

                return marker;

            });
        },
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            userPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(userPos);
            infoWindow.setContent('Location found.');

            map.setCenter(userPos);

            var marker = new google.maps.Marker({
                position: userPos,
                map: map,
                icon: { url: iconMyPosition, scaledSize: new google.maps.Size(45, 45) }
            });

            contentString = '';
            contentString += '<div class="container marker-popup" style="max-width:35rem;">';
            contentString += '<div class="row">';
            contentString += '<div class="col-9 d-flex align-items-center justify-content-center">';
            contentString += '<div><p class="popup-title">Aquí se encuentra usted</p></div>';

            contentString += '</div>';
            contentString += '<div class="col-3 popup-right">';
            contentString += '<img src="../../Content/Images/Distribuidores/map-marker-tfsm.png" />';
            contentString += '</div>';

            contentString += '</div>';
            contentString += '</div>';

            marker.info = new google.maps.InfoWindow({

                content: contentString

            });


            google.maps.event.addListener(marker, 'click', function () {

                if (lastMarker) {
                    lastMarker.info.close();
                }
                marker.info.open(map, marker);
                lastMarker = marker;
                map.setZoom(15);
                map.setCenter(userPos);
            });

            var centerControlDiv = document.createElement('div');
            CenterControl(centerControlDiv, map, userPos);

            centerControlDiv.index = 1;
            centerControlDiv.className = 'myLocationContainer';
            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
            //map.setCenter({ lat: dealers[0].Lat, lng: dealers[0].Lng })
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
        map.setCenter({ lat: dealers[0].Lat, lng: dealers[0].Lng })
    }

};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    //infoWindow.open(map);
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

    $("#contact-form").validate({
        rules: {
            name: {
                required: true
            },
            phone: {
                required: true
            },
            email: {
                required: true,
                isEmail: true
            }
        }
    });

    $("#contact-form").submit(function (e) {
        e.preventDefault();
    });

    $("#sendContact").click(function () {
        closeModal("contactModal");
        if ($("#contact-form").valid()) {

            var data = {};
            data.CodigoDistribuidor = $("#dealerId").val();
            data.Nombre = $('#contact-name').val();
            data.Movil = $('#contact-phone').val();
            data.Email = $('#contact-email').val();

            $.ajax({
                type: 'POST',
                url: window.config.urlbase + '/SalesForceDistribuidores',
                data: data,
                beforeSend: showLoader,
                complete: hideLoader,
                dataType: "json",
                success: function (result) {
                    console.log(result);
                    Toastnotify.create({
                        text: "¡Gracias! Nos pondremos en contacto contigo.",
                        duration: 5000
                    });
                },
                error: function (err) {
                    consoler.log(err);
                    swal.fire({
                        title: "Ocurrió un error",
                        text: "Por favor recargue la página e intente de nuevo.",
                        icon: "error"
                    });
                }
            });
        }
    });

});

function getDistance(lat, lng) {
    let testPos = { lat: 20.5974244, lng: -103.4430505 };

    var myHeaders = new Headers();
    myHeaders.append('Access-Control-Allow-Origin', '*');
    myHeaders.append('Access-Control-Allow-Credentials', 'application/json');
    myHeaders.append('Content-Type', true);

    //{
    //    //'Access-Control-Allow-Origin': 'https://maps.googleapis.com',
    //    'Access-Control-Allow-Origin': '*',
    //    "Access-Control-Allow-Credentials": true,
    //};

    var myInit = {
        method: 'GET',
        headers: myHeaders,
        crossorigin: 'anonymous',
        cache: 'default',
    };

    //fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${testPos.lat},${testPos.lng}&destinations=${lat},${lng}&key=${apiKey}`, myInit)
    //    .then(response => response.json())
    //    .catch(error => console.error('Error:', error))
    //    .then(response => console.log('Success:', response));

    $.ajax({
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${testPos.lat},${testPos.lng}&destinations=${lat},${lng}&key=${apiKey}`,
        method: 'GET',
        async: false,
        //crossDomain: 'anonymous',
        //mode: 'cors',
        headers: myHeaders,
        error: (err) => {
            console.log(err);
            distance = "";
        },
        success: (res) => {
            console.log(res);
        }
    })


    //console.log(distance);
    //return distance;
}

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
            createDealerCards(data);
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
            createDealerCards(data);
        },
        complete: () => $("#dealer-loader").hide()
    })
}

function createDealerCards(data) {
    let dealers = document.createElement('div');

    const service = new google.maps.DistanceMatrixService();
    let testPos = { lat: 20.5974244, lng: -103.4430505 };

    data.results.forEach(function (x) {
        let card = document.createElement('div');
        let title = document.createElement('div');
        let address = document.createElement('div');

        card.classList.add("dealer-result");
        card.classList.add("ripple");
        title.classList.add("dealer-result-title");
        address.classList.add("dealer-result-address");

        title.innerHTML = capitalize(x.Dealer);
        address.innerHTML = x.Adress;
        card.append(title);
        card.append(address);

        //if (userPos) {
        //    let distance = document.createElement('div');

        //    console.log(getDistance(x.Lat, x.Lng));

        //}

        card.dataset["lat"] = x.Lat;
        card.dataset["lng"] = x.Lng;
        card.dataset["dealerId"] = x.IdDealer;

        dealers.append(card);
    });

    $("#dealer-loader").hide();
    $("#results-list").html(dealers.innerHTML);

    $(".dealer-result").click(function () {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');

        let lat = Number(this.dataset["lat"]);
        let lng = Number(this.dataset["lng"]);

        map.setCenter({ lat, lng });
        map.setZoom(15);

    });
}

function getAllDealers() {
    $.ajax({
        type: "get",
        url: window.config.urlbase + "/getdealers",
        datatype: "json",
        success: function (data) {
            dealers = data.results;
        },
    })
}

var deviceWidth = () =>
    window.innerWidth > 0 ? window.innerWidth : screen.width;

function openModal(modalId) {
    const modal = $(`#${modalId}`);
    document.body.style.overflow = "hidden";
    $("#modalOverlay").show("fade");
    console.log(modal);
    if (modal.id === "newsletterTermsModal") {
        let body = modal.querySelector(".modal-body-custom");
        $(body).animate({ scrollTop: $(body).offset().top - 20 }, "fast");
    }

    if (deviceWidth() <= 767) {
        modal.show("slide", { direction: "down" });
    } else {
        modal.animate(
            {
                display: "toggle",
                opacity: 1,
                top: "-=50",
            },
            400,
            () => modal.css({ display: "block" })
        );
    }
}