if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.AccountPlace) == "undefined") CmsShop.AccountPlace = {};

CmsShop.AccountPlace = {
    markers: [],
    currentDatetime: logisticJs.dateNow(),
    currentUserId: 0,
    params: {}
};

CmsShop.AccountPlace.Init = function () {
    var p = this;    

    logisticJs.activeMenuSidebar('/AccountPlace');
};

CmsShop.AccountPlace.InitMap = function () {
    var p = this;

    if (location.search) {
        var parts = location.search.substring(1).split('&');

        for (var i = 0; i < parts.length; i++) {
            var nv = parts[i].split('=');
            if (!nv[0]) continue;
            p.params[nv[0]] = nv[1] || true;
        }
    }

    var $maps = $('#maps');
    
    var $widgetbodymap = $('#widget-body-map');
    $maps.css({ height: $(window).height() - 185 });
    
    $widgetbodymap.css({ height: $(window).height() - 95 });    
   
    var styledMapType = new google.maps.StyledMapType(
            [
              {
                  "featureType": "administrative",
                  "elementType": "geometry",
                  "stylers": [
                    {
                        "visibility": "off"
                    }
                  ]
              },
              {
                  "featureType": "administrative.land_parcel",
                  "stylers": [
                    {
                        "visibility": "off"
                    }
                  ]
              },
              {
                  "featureType": "administrative.neighborhood",
                  "stylers": [
                    {
                        "visibility": "off"
                    }
                  ]
              },
              {
                  "featureType": "poi",
                  "stylers": [
                    {
                        "visibility": "off"
                    }
                  ]
              },
              {
                  "featureType": "road",
                  "elementType": "labels",
                  "stylers": [
                    {
                        "visibility": "off"
                    }
                  ]
              },
              {
                  "featureType": "road",
                  "elementType": "labels.icon",
                  "stylers": [
                    {
                        "visibility": "off"
                    }
                  ]
              },
              {
                  "featureType": "transit",
                  "stylers": [
                    {
                        "visibility": "off"
                    }
                  ]
              },
              {
                  "featureType": "water",
                  "elementType": "labels.text",
                  "stylers": [
                    {
                        "visibility": "off"
                    }
                  ]
              }
            ],
            { name: 'Styled Map' });
       
    var myLatLng = new google.maps.LatLng(21.0026, 105.8056);
    var mapOptions = {
        zoom: 13,
        center: myLatLng,
        //mapTypeId: 'styled_map',//['roadmap', 'styled_map'],//google.maps.MapTypeId.ROADMAP,
        streetViewControl: true
    };
    var map = new google.maps.Map($maps[0], mapOptions);

    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
               
    $("#txtDatetimeSearch").val(p.currentDatetime).datepicker({ format: 'dd/mm/yyyy' }).on('changeDate', function (e) {
        $(this).datepicker('hide');        
        p.currentDatetime = logisticJs.formatDateDMY(e.date);

        p.SetMapOnAll(null);

        p.LoadAllAccountPlaceByUserAndDate(map, function (data) {
            $.each(data, function (i, item) {
                var myLatLng = { lat: parseFloat(item.Lag), lng: parseFloat(item.Lng) };
                p.AddMarker(myLatLng, item, 'default1', map);
            });
            //move map to latlng
            setTimeout(function () {
                if (data.length > 0) {
                    map.panTo(new google.maps.LatLng(parseFloat(data[0].Lag), parseFloat(data[0].Lng)));
                }
            }, 500);
        });

    });

    p.GetAllAccountByType(map, function () {
        p.currentUserId = (p.params.accountId == undefined) ? 0 : p.params.accountId;
        $("#sltAccountSearch").val(p.currentUserId).select2();        
    });
    
    $("#sltAccountSearch").off("change").on("change", function () {

        p.currentUserId = $("#sltAccountSearch").val();
        $('#btnAddAccountPlaceByUser').attr('data-user', p.currentUserId);
        
        p.SetMapOnAll(null);

        p.LoadAllAccountPlaceByUserAndDate(map, function (data) {
            $.each(data, function (i, item) {
                var myLatLng = { lat: parseFloat(item.Lag), lng: parseFloat(item.Lng) };
                p.AddMarker(myLatLng, item, 'default1', map);
            });
            //move map to latlng
            setTimeout(function () {
                if (data.length > 0) {
                    map.panTo(new google.maps.LatLng(parseFloat(data[0].Lag), parseFloat(data[0].Lng)));
                }
            }, 500);
        });
    });
};

CmsShop.AccountPlace.AddMarker = function (location, data, image, map) {
    var p = this;

    var currentIcon = {
        path: google.maps.SymbolPath.CIRCLE,//'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
        fillColor: 'green',
        fillOpacity: 0.5,
        scale: 3,
        strokeColor: 'green',
        strokeWeight: 14
    };    
    if (image == 'default1') {
        image = 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png';
    }
    if (image == 'default2') {
        image = 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png';
    }
    if (image == 'checkedicon') {
        image = 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png';
    }
    if (image == 'currenticon') {
        image = currentIcon;
    }
    var marker = new google.maps.Marker({
        position: location,
        label: '',
        title: data.Name,
        icon: image,
        map: map,
        draggable: false
    });
    marker.addListener('click', function () {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        
        var contentString = 'Vị trí: ' + data.Lag + " , " + data.Lng + '</p>' +            
            '<p class="checkeddate">Lúc: ' + logisticJs.dateFormatJson2(data.Datetime) + '</p>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        infowindow.open(map, marker);
    });    

    if (data.Name != "Vị trí hiện tại")
        p.markers.push(marker);
        
};

CmsShop.AccountPlace.SetMapOnAll = function(map) {
    var p = this;

    for (var i = 0; i < p.markers.length; i++) {
        p.markers[i].setMap(map);
    }
};

CmsShop.AccountPlace.GetAllAccountByType = function (map, callback) {
    var p = this;    

    var dataparam = { type:2};

    $.ajax({
        type: "GET",
        url: "/Account/ListAllByType",
        data: dataparam,
        dataType: "json",
        beforeSend: function() {
            //logisticJs.startLoading();
        },
        success: function(response) {
            if (response.status == true && response.totalCount > 0) {
                var template = $("#data-list-account").html();
                var render = "";
                $.each(response.Data, function(i, item) {
                    render += Mustache.render(template, {                        
                        id: item.Id,
                        name: item.DisplayName
                    });
                });
                if (render != undefined) {
                    $("#sltAccountSearch").append(render);
                }
                p.RegisterEvents(map);                

            } 
            //logisticJs.stopLoading();  
            if (typeof (callback) == "function") {
                callback();
            }
        },
        error: function(status) {
            //logisticJs.stopLoading();
        }
    });
};

CmsShop.AccountPlace.RegisterEvents = function(map) {
    var p = this;

    $('#btnPreviewListAccountPlace').off('click').on('click', function () {
        var $this = $(this);
        if ($('i', $this).hasClass('fa-list')) {
            $('#previewListAccountPlace').show(500);
            $('#maps').hide(500);
            $('i', $this).addClass('fa-map-marker').removeClass('fa-list');
        } else {
            $('#maps').show(500);
            $('#previewListAccountPlace').hide(500);
            $('i', $this).addClass('fa-list').removeClass('fa-map-marker');
        }
    });     
};

CmsShop.AccountPlace.LoadAllAccountPlaceByUserAndDate = function (map, callback) {
    var p = this;

    var dataparam = { accountId: p.currentUserId, dateTime: p.currentDatetime };

    $.ajax({
        type: "GET",
        url: "/AccountPlace/LoadAllAccountPlaceByUserAndDate",
        data: dataparam,
        dataType: "json",
        beforeSend: function () {
            logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status == true && response.totalCount > 0) {
                var template = $("#package-data-localtion").html();
                var render = "";                
                $.each(response.Data, function (i, item) {                    
                    render += Mustache.render(template, {
                        stt: i + 1, id: item.Id, lag: item.Lag, lng: item.Lng, datetime: logisticJs.convertDatetimeDMY(item.Datetime)
                    });                    
                });
                if (render != undefined) {
                    $("#listAllAccountPlace").html(render);
                }                                               
            } else {
                $("#listAllAccountPlace").html('');
            }
            logisticJs.stopLoading();

            if (typeof (callback) == "function") {
                callback(response.Data);
            }
        },
        error: function (status) {
            logisticJs.stopLoading();
        }
    });
};

$(function () {
    CmsShop.AccountPlace.Init();
});