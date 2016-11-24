var map;
var circle;
var infowindow;
var markers = [];

function initMap() {
    var $maps = $('#maps');
    var $widgetbodyuser = $('#widget-body-user');
    var $widgetbodymap = $('#widget-body-map');
    $maps.css({ height: $(window).height() - 90 });
    $widgetbodyuser.css({ height: $(window).height() - 90 });
    $widgetbodymap.css({ height: $(window).height() - 90 });

    //get all user
    getAllUser();

    var myLatLng = new google.maps.LatLng(21.0026, 105.8056);
    var mapOptions = {
        zoom: 11,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: true
    };
    map = new google.maps.Map($maps[0],
        mapOptions);

    var image = {
        url: '/assets/img/favicon.png',
        size: new google.maps.Size(20, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32)
    }
    image = '';
    addMarker(myLatLng, '', 'VP VCCORP', image, map);

    circle = new google.maps.Circle({
        strokeColor: '#2dc3e8',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#2dc3e8',
        fillOpacity: 0.35,
        center: myLatLng,
        radius: Math.sqrt(20000) * 100
    });
    circle.setMap(map);

    var contentString = '<div id="content">' +
      '<div id="siteNotice">' + 'Nguyễn Bá Chính' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">VCCorp</h1>' +
      '<div id="bodyContent">' +
      '<p><b>VCCorp</b>, Công ty có trụ sở chính đặt tại Tầng 17, 19, 20, 21 ' +
      'Toà nhà Center Building – Hapulico Complex, số 1 Nguyễn Huy Tưởng, ' +
      'phường Thanh Xuân Trung, quận Thanh Xuân, TP Hà Nội.</p>' +
      '<p>VCCorp, <a href="https://vccorp.vn/?title=VCCorp"</a> ' +
      '(VCCorp Corporation).</p>' +
      '</div>' +
      '</div>';

    infowindow = new google.maps.InfoWindow({
        content: contentString
    });



    //var panorama = new google.maps.StreetViewPanorama(
    //    document.getElementById('panorama'), {
    //        position: { lat: 21.0026, lng: 105.8056 },
    //        pov: {
    //            heading: 265,
    //            pitch: 10
    //        }
    //    });
    //map.setStreetView(panorama);

}

function addMarker(location, label, title, image, map) {
    var goldStar = {
        path: google.maps.SymbolPath.CIRCLE,//'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
        fillColor: '#FF0000',
        fillOpacity: 0.8,
        scale: 3,
        strokeColor: '#FF0000',
        strokeWeight: 14
    };
    if (image == 'default') {
        image = null;
    }
    if (image == '') {
        image = goldStar;
    }
    var marker = new google.maps.Marker({
        position: location,
        label: label,
        title: title,
        icon: image,
        map: map,
        draggable: true
    });
    marker.addListener('click', function () {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        infowindow.open(map, marker);
    });
    if (title != 'VP VCCORP')
        markers.push(marker);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function getAllUser() {
    $.get("api/userApi", function (data) {
        $.each(data, function (i, item) {
            var temp = "<tr><td>" + item.Id + "</td><td>" + item.DisplayName + "</td></tr>";
            $("#GetAllUser").append(temp);
        });

        $('table #GetAllUser tr').off('click').on('click', function () {

            setMapOnAll(null);

            var myLatLng = { lat: 21.026, lng: 105.8056 };

            addMarker(myLatLng, '', 'M1', 'default', map);

            var myLatLng2 = { lat: 21.067, lng: 105.786 };

            addMarker(myLatLng2, '', 'M2', 'default', map);

            var myLatLng3 = { lat: 21.067, lng: 105.786 };

            addMarker(myLatLng3, '', 'M3', 'default', map);
        });
    });
}

function logout() {
    $('#btnThoat').off('click').on('click', function () {
        $.get("/Login/Logout", function (data) {
            
        });
    });
}