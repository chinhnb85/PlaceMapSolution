if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.MapProvince) == "undefined") CmsShop.MapProvince = {};

CmsShop.MapProvince = {
    markers: [],        
    pageSize: 1000,
    pageIndex: 1,
    keySearch: '',
    currentUserId: 0,
    parentId: 0,
    provinceId: 0,
    params: {}
};

CmsShop.MapProvince.Init = function () {
    var p = this;    

    logisticJs.activeMenuSidebar('/');

    p.LoadAllProvince(function () {        
        $("#sltProvinceSearch").select2();
    });

    p.LoadAllAccountByType(function () {
        $("#sltAccount").select2();        
    });
};

CmsShop.MapProvince.InitMap = function () {
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
    $maps.css({ height: $(window).height() - 165 });    
    $widgetbodymap.css({ height: $(window).height() - 165 });    
   
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

    p.RegisterEvents(map);
};

CmsShop.MapProvince.HandleLocationError = function (browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Không lấy được vị trí hiện tại.' :
                          'Trình duyệt của bạn không được hỗ trợ.');
};

CmsShop.MapProvince.AddMarker = function (location, data, image, map) {
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
    var prev_infowindow = false;
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
        if (prev_infowindow) {
            prev_infowindow.close();
        }
        prev_infowindow = infowindow;
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

CmsShop.MapProvince.SetMapOnAll = function(map) {
    var p = this;

    for (var i = 0; i < p.markers.length; i++) {
        p.markers[i].setMap(map);
    }
};

CmsShop.MapProvince.RegisterEvents = function(map) {
    var p = this;

    $('#btnPreviewListLocaltion').off('click').on('click', function () {
        var $this = $(this);
        if ($('i', $this).hasClass('fa-list')) {
            $('#previewListLocaltion').show(500);
            $('#maps').hide(500);
            $('i', $this).addClass('fa-map-marker').removeClass('fa-list');
        } else {
            $('#maps').show(500);
            $('#previewListLocaltion').hide(500);
            $('i', $this).addClass('fa-list').removeClass('fa-map-marker');
        }
    });
    
    $("#sltParentSearch").off("change").on("change", function () {
        p.parentId = $("#sltParentSearch").val();
        p.pageIndex = 1;
        p.SetMapOnAll(null);

        p.LoadAllLocaltionByProvince(map, function (data) {            
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
    $("#sltProvinceSearch").off("change").on("change", function () {
        p.provinceId = $("#sltProvinceSearch").val();
        p.pageIndex = 1;
        p.SetMapOnAll(null);

        p.LoadAllLocaltionByProvince(map, function (data) {
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
    $("#sltAccount").off("change").on("change", function () {
        p.currentUserId = $("#sltAccount").val();
        p.pageIndex = 1;
        p.SetMapOnAll(null);

        p.LoadAllLocaltionByProvince(map, function (data) {
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
    
    $("#txtSearchLocaltion").off("change keydown paste input").on("change keydown paste input", function () {
        p.keySearch = $("#txtSearchLocaltion").val();
        if (p.keySearch == "" || p.keySearch.length > 2) {
            p.pageIndex = 1;
            p.SetMapOnAll(null);

            p.LoadAllLocaltionByProvince(map, function (data) {
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
        }
    });    
    
};

CmsShop.MapProvince.LoadAllLocaltionByProvince = function (map, callback) {
    var p = this;

    var dataparam = { accountId: p.currentUserId, parentId: p.parentId, provinceId: p.provinceId, keySearch: p.keySearch, pageIndex: p.pageIndex, pageSize: p.pageSize };

    $.ajax({
        type: "GET",
        url: "/Localtion/ListAllPagingByStatus",
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
                    $("#listAllLocaltion").html(render);
                }
                p.WrapPagingLocaltion(response.totalCount, '#btnNextLocaltion', '#btnPreviousLocaltion', response.totalRow, function () {
                    p.LoadAllLocaltionByProvince(map);
                });

                $(".delete").off("click").on("click", function () {
                    var $this = $(this);
                    p.UpdateStatusLocaltion($this.attr('data-id'), function () {
                        p.LoadAllLocaltionByProvince(map, function (data) {
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
                    p.ViewDetailLocaltionNow($this.attr('data-id'), function () {
                        $('#myModalLocaltionDetail').modal('show');
                    });
                });

            } else {
                $("#listAllLocaltion").html('');
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

CmsShop.MapProvince.WrapPagingLocaltion = function (total, next, previous, recordCount, callBack) {
    var p = this;

    var totalsize = Math.ceil(recordCount / p.pageSize);
    var pg = "";
    if (totalsize > 1)
        $('#pagerLocaltion').removeClass('hide');
    else
        $('#pagerLocaltion').addClass('hide');
    pg = logisticJs.paginate(p.pageIndex, recordCount, p.pageSize);
    $('#pagerLocaltion').find('.pg').remove();
    $('.btnPreviousLocaltion').after(pg);
    $('#pagerLocaltion').find('.pg_' + p.pageIndex).addClass('active');
    if (total >= p.pageSize) {
        $('.btnNextLocaltion').removeClass('disabled');
    } else {
        $('.btnNextLocaltion').addClass('disabled');
    }
    if (p.pageIndex > 1) {
        $('.btnPreviousLocaltion').removeClass('disabled');
    } else {
        $('.btnPreviousLocaltion').addClass('disabled');
    }
    $(next).off('click').on('click', function () {
        if ($('.btnNextLocaltion').hasClass('disabled')) return false;
        p.pageIndex++;
        setTimeout(callBack(), 200);
        return false;
    });
    $(previous).off('click').on('click', function () {
        if ($('.btnPreviousLocaltion').hasClass('disabled')) return false;
        p.pageIndex--;
        setTimeout(callBack(), 200);
        return false;
    });

    $('#pagerLocaltion').find('.pg').off('click').on('click', function () {
        var curentPage = $(this).attr("data-page");
        p.pageIndex = curentPage;
        $('#pagerLocaltion').find('.pg').removeClass('active');
        $(this).addClass('active');
        callBack();
    });
};

CmsShop.MapProvince.UpdateStatusLocaltion = function (id,callback) {
    var p = this;
    $.ajax({
        type: "GET",
        url: "/Localtion/UpdateStatus",
        data: { Id: id },
        dataType: "json",
        beforeSend: function () {
            //logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status) {
                if (typeof(callback) == "function") {
                    callback();
                }
            }
            //logisticJs.stopLoading();
        },
        error: function (status) {
            //logisticJs.stopLoading();
        }
    });
};

CmsShop.MapProvince.ViewDetailLocaltionNow = function (id, callback) {
    var p = this;
    $.ajax({
        type: "GET",
        url: "/Localtion/ViewDetailLocaltionNow",
        data: { Id: id },
        dataType: "json",
        beforeSend: function () {
            logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status) {
                if (response.Data != null) {
                    var template = $("#package-data-viewDetailLocaltion").html();
                    var isChecked = "";
                    var isCheckedName = "Chưa checked";
                    if (response.Data.IsCheck) {
                        isChecked = "checked";
                        isCheckedName = "Đã checked lúc: " + logisticJs.dateFormatJson2(response.Data.CheckDate);
                    }
                    var customeTypeName = "Bán buôn";
                    if (response.Data.CustomeType==2) {
                        customeTypeName = "Bán lẻ";
                    }
                    var render = Mustache.render(template, {
                        id: response.Data.Id, name: response.Data.Name, avatar: response.Data.Avatar,
                        address: response.Data.Address, isChecked: isChecked, lag: response.Data.Lag,
                        lng: response.Data.Lng, phone: response.Data.Phone, email: response.Data.Email,
                        isCheckedName: isCheckedName, accountId: response.Data.AccountId, customeType: customeTypeName
                    });
                    $('#viewDetailLocaltion').html(render);
                }                
                if (typeof (callback) == "function") {
                    callback();
                }
            }
            logisticJs.stopLoading();
        },
        error: function (status) {
            logisticJs.stopLoading();
        }
    });
};

CmsShop.MapProvince.LoadAllProvince = function (callback) {

    var dataparam = {};

    $.ajax({
        type: "GET",
        url: "/Province/ListAll",
        data: dataparam,
        dataType: "json",
        beforeSend: function () {
            //logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status == true && response.totalCount > 0) {
                var template = $("#data-list-province").html();
                var render = "";
                $.each(response.Data, function (i, item) {
                    render += Mustache.render(template, {
                        id: item.Id, name: item.Name
                    });
                });
                if (render != undefined) {                    
                    $("#sltProvinceSearch").append(render);
                }
            }
            //logisticJs.stopLoading();

            if (typeof (callback) == "function") {
                callback();
            }
        },
        error: function (status) {
            //logisticJs.stopLoading();
        }
    });
};

CmsShop.MapProvince.LoadAllAccountByType = function (callback) {

    var dataparam = { type: 2 };

    $.ajax({
        type: "GET",
        url: "/Account/ListAllByType",
        data: dataparam,
        dataType: "json",
        beforeSend: function () {
            //logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status == true && response.totalCount > 0) {
                var template = $("#data-list-account").html();
                var render = "";
                $.each(response.Data, function (i, item) {
                    render += Mustache.render(template, {
                        id: item.Id, displayName: item.DisplayName
                    });
                });
                if (render != undefined) {
                    $("#sltAccount").append(render);                    
                }
            }
            //logisticJs.stopLoading();

            if (typeof (callback) == "function") {
                callback();
            }
        },
        error: function (status) {
            //logisticJs.stopLoading();
        }
    });
};

$(function () {
    CmsShop.MapProvince.Init();
});