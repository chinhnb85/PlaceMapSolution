if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.AccountPlace) == "undefined") CmsShop.AccountPlace = {};

CmsShop.AccountPlace = {
    markers: [],
    pageSize: 20,
    pageIndex: 1,
    keySearch: '',
    type: 2,
    pageSizeAccountPlace: 50,
    pageIndexAccountPlace: 1,
    keySearchAccountPlace: '',
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
    $maps.css({ height: $(window).height() - 95 });
    
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
    
    var lag = (p.params.lag == undefined) ? 21.0026 : p.params.lag;
    var lng = (p.params.lng == undefined) ? 105.8056 : p.params.lng;

    var myLatLng = new google.maps.LatLng(lag, lng);
    var mapOptions = {
        zoom: 13,
        center: myLatLng,
        //mapTypeId: 'styled_map',//['roadmap', 'styled_map'],//google.maps.MapTypeId.ROADMAP,
        streetViewControl: true
    };
    var map = new google.maps.Map($maps[0], mapOptions);

    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
       
    p.GetAllAccountByStatus(map, function () {
        p.GetViewCurrentAccountMap(map);
    });
};

CmsShop.AccountPlace.GetViewCurrentAccountMap = function (map) {
    var p = this;

    var accountId = (p.params.accountId == undefined) ? 0 : p.params.accountId;
    var $this = $('table #listAllAccount tr[data-id="' + accountId + '"]');
    $this.css({ 'background-color': '#f5f5f5' });
    $this.attr('data-active', 1);

    $('#btnAddAccountPlaceByUser').attr('data-user', $this.attr('data-id'));
    p.currentUserId = accountId;

    p.SetMapOnAll(null);        

    if (p.currentUserId != 0) {
        p.LoadAllAccountPlaceByUser(p.currentUserId, map, function (data) {
            $.each(data, function (i, item) {
                var myLatLng = { lat: parseFloat(item.Lag), lng: parseFloat(item.Lng) };
                if (item.IsCheck) {
                    p.AddMarker(myLatLng, item, 'checkedicon', map);
                } else {
                    if (item.CustomeType == 2) {
                        p.AddMarker(myLatLng, item, 'default2', map);
                    } else {
                        p.AddMarker(myLatLng, item, 'default1', map);
                    }
                }
            });
        });
    }
}

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
        var isCheckedName = "<span class='unchecked'>Chưa checked" + "</span>";
        if (data.IsCheck) {
            isCheckedName = "<span class='checked'>Đã checked lúc: " + logisticJs.dateFormatJson2(data.CheckDate)+"</span>";
        }
        var contentString = '<img src="'+data.Avatar+'" class="mapimage" />'+
            '<p class="maptitle">' + data.Name + '</p>'+
            '<p class="maplaglng">Khách hàng(<b>'+((data.CustomeType==2)?"Bán lẻ":"Bán buôn")+'</b>) - Vị trí: ' + data.Lag + " , " + data.Lng + '</p>' +
            '<p class="mapphone">Điện thoại: ' + data.Phone + " - Email: " + data.Email + '</p>' +
            '<p class="checkeddate">Trạng thái: ' + isCheckedName + '</p>' +
            '<p class="mapaddress">Đ/c: ' + data.Address +'</p>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        infowindow.open(map, marker);
    });

    if (p.params.lag != undefined && p.params.lag == location.lat) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        var contentString = '<img src="' + data.Avatar + '" class="mapimage" />' +
            '<p class="maptitle">' + data.Name + '</p>' +
            '<p class="maplaglng">Khách hàng(<b>' + ((data.CustomeType == 2) ? "Bán lẻ" : "Bán buôn") + '</b>) - Vị trí: ' + data.Lag + " , " + data.Lng + '</p>' +
            '<p class="mapphone">Điện thoại: ' + data.Phone + " - Email: " + data.Email + '</p>' +
            '<p class="mapaddress">Đ/c: ' + data.Address + '</p>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        infowindow.open(map, marker);
    }

    if (data.Name != "Vị trí hiện tại")
        p.markers.push(marker);
        
};

CmsShop.AccountPlace.SetMapOnAll = function(map) {
    var p = this;

    for (var i = 0; i < p.markers.length; i++) {
        p.markers[i].setMap(map);
    }
};

CmsShop.AccountPlace.GetAllAccountByStatus = function(map,callback) {
    var p = this;    

    var dataparam = { type: p.type, keySearch: p.keySearch, pageIndex: p.pageIndex, pageSize: p.pageSize };

    $.ajax({
        type: "GET",
        url: "/Account/ListAllPagingByStatus",
        data: dataparam,
        dataType: "json",
        beforeSend: function() {
            //logisticJs.startLoading();
        },
        success: function(response) {
            if (response.status == true && response.totalCount > 0) {
                var template = $("#package-data").html();
                var render = "";
                $.each(response.Data, function(i, item) {
                    render += Mustache.render(template, {
                        stt: i + 1,
                        id: item.Id,
                        displayName: item.DisplayName
                    });
                });
                if (render != undefined) {
                    $("#listAllAccount").html(render);
                }
                p.RegisterEvents(map);

                p.WrapPaging(response.totalCount, '#btnNext', '#btnPrevious', response.totalRow, function() {
                    p.GetAllAccountByStatus(map);
                });

            } else {
                $("#listAllAccount").html('');
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
   
    $('table #listAllAccount tr').off('click').on('click', function() {
        
        $('table #listAllAccount tr[data-active="1"]').css({ 'background-color': '#fff' });
        $('table #listAllAccount tr[data-active="1"]').attr('data-active', 0);

        var $this = $(this);
        $this.css({ 'background-color': '#f5f5f5' });
        $this.attr('data-active', 1);

        $('#btnAddAccountPlaceByUser').attr('data-user', $this.attr('data-id'));
        p.currentUserId = $this.attr('data-id');

        p.SetMapOnAll(null);        

        p.LoadAllAccountPlaceByUser(p.currentUserId, map, function (data) {
            $.each(data, function (i, item) {
                var myLatLng = { lat: parseFloat(item.Lag), lng: parseFloat(item.Lng) };
                if (item.IsCheck) {
                    p.AddMarker(myLatLng, item, 'checkedicon', map);
                } else {                    
                    if (item.CustomeType == 2) {
                        p.AddMarker(myLatLng, item, 'default2', map);
                    } else {
                        p.AddMarker(myLatLng, item, 'default1', map);
                    }
                }
            });
            //move map to latlng
            setTimeout(function () {
                if (data.length > 0) {
                    map.panTo(new google.maps.LatLng(parseFloat(data[0].Lag), parseFloat(data[0].Lng)));
                }
            }, 500);
        });
    });

    $("#txtSearch").off("change keydown paste input").on("change keydown paste input", function () {
        p.keySearch = $("#txtSearch").val();
        if (p.keySearch == "" || p.keySearch.length > 2) {
            p.pageIndex = 1;
            p.GetAllAccountByStatus(map);
        }
    });

    $("#txtSearchAccountPlace").off("change keydown paste input").on("change keydown paste input", function () {
        p.keySearchAccountPlace = $("#txtSearchAccountPlace").val();
        if (p.keySearchAccountPlace == "" || p.keySearchAccountPlace.length > 2) {
            p.pageIndexAccountPlace = 1;
            p.LoadAllAccountPlaceByUser(p.currentUserId, map);
        }
    });    
};

CmsShop.AccountPlace.LoadAllAccountPlaceByUser = function (accountId, map, callback) {
    var p = this;

    var dataparam = { accountId: accountId, keySearch: p.keySearchAccountPlace, pageIndex: p.pageIndexAccountPlace, pageSize: p.pageSizeAccountPlace };

    $.ajax({
        type: "GET",
        url: "/AccountPlace/ListAllPagingByStatus",
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
                    var isChecked = "";
                    var isCheckedName = "Chưa checked"
                    if (item.IsCheck) {
                        isChecked = "checked";
                        isCheckedName = "Đã checked lúc " + logisticJs.dateFormatJson2(item.CheckDate)
                    }
                    var avatar = "/assets/img/avatars/no-avatar.gif";
                    if (item.Avatar != "" && item.Avatar!=null) {
                        avatar = item.Avatar;
                    }
                    render += Mustache.render(template, {
                        stt: i + 1, id: item.Id, name: item.Name, avatar: avatar, address: item.Address, isChecked: isChecked, isCheckedName: isCheckedName
                    });                    
                });
                if (render != undefined) {
                    $("#listAllAccountPlace").html(render);
                }
                p.WrapPagingAccountPlace(response.totalCount, '#btnNextAccountPlace', '#btnPreviousAccountPlace', response.totalRow, function () {
                    p.LoadAllAccountPlaceByUser(p.currentUserId, map);
                });

                $(".delete").off("click").on("click", function () {
                    var $this = $(this);
                    p.UpdateStatusAccountPlace($this.attr('data-id'), function () {
                        p.LoadAllAccountPlaceByUser(p.currentUserId, map, function (data) {
                            p.SetMapOnAll(null);
                            $.each(data, function (i, item) {
                                var myLatLng = { lat: parseFloat(item.Lag), lng: parseFloat(item.Lng) };
                                if (item.IsCheck) {
                                    p.AddMarker(myLatLng, item, 'checkedicon', map);
                                } else {                                    
                                    if (item.CustomeType == 2) {
                                        p.AddMarker(myLatLng, item, 'default2', map);
                                    } else {
                                        p.AddMarker(myLatLng, item, 'default1', map);
                                    }
                                }
                            });
                        });
                    });
                });
                $(".viewdetail").off("click").on("click", function () {
                    var $this = $(this);
                    p.ViewDetailAccountPlaceNow($this.attr('data-id'), function () {
                        $('#myModalAccountPlaceDetail').modal('show');
                    });
                });

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

CmsShop.AccountPlace.WrapPaging = function (total, next, previous, recordCount, callBack) {
    var p = this;
    
    var totalsize = Math.ceil(recordCount / p.pageSize);    
    var pg = "";
    if (totalsize > 1)
        $('#pager').removeClass('hide');
    else
        $('#pager').addClass('hide');
    pg = logisticJs.paginate(p.pageIndex, recordCount, p.pageSize);
    $('#pager').find('.pg').remove();
    $('.btnPrevious').after(pg);
    $('#pager').find('.pg_' + p.pageIndex).addClass('active');
    if (total >= p.pageSize) {
        $('.btnNext').removeClass('disabled');
    } else {
        $('.btnNext').addClass('disabled');
    }
    if (p.pageIndex > 1) {
        $('.btnPrevious').removeClass('disabled');
    } else {
        $('.btnPrevious').addClass('disabled');
    }
    $(next).off('click').on('click', function () {
        if ($('.btnNext').hasClass('disabled')) return false;
        p.pageIndex++;
        setTimeout(callBack(), 200);
        return false;
    });
    $(previous).off('click').on('click', function () {
        if ($('.btnPrevious').hasClass('disabled')) return false;
        p.pageIndex--;
        setTimeout(callBack(), 200);
        return false;
    });

    $('#pager').find('.pg').off('click').on('click', function () {
        var curentPage = $(this).attr("data-page");
        p.pageIndex = curentPage;
        $('#pager').find('.pg').removeClass('active');
        $(this).addClass('active');
        callBack();
    });
};


CmsShop.AccountPlace.AddNewAccountPlace = function (form,callback) {
    var p = this;

    $.ajax({
        type: "POST",
        url: "/AccountPlace/AddNew",
        data: $(form).serialize(),
        dataType: "json",
        beforeSend: function () {
            logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status) {
                logisticJs.msgShowSuccess({ titleHeader: 'Lưu thành công.' });
                if (typeof (callback) == 'function') {
                    callback();
                }
            } else {
                logisticJs.msgWarning({
                    text: "Việc lưu tài khoản gặp lỗi.",
                    modal: true
                });
            }
            logisticJs.stopLoading();
        },
        error: function () {
            logisticJs.stopLoading();
        }
    });
};

$(function () {
    CmsShop.AccountPlace.Init();
});