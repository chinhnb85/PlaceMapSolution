if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.Home) == "undefined") CmsShop.Home = {};

CmsShop.Home = {
    markers: [],
    pageSize: 20,
    pageIndex: 1,
    keySearch: '',
    type: 2,
    pageSizeLocaltion: 50,
    pageIndexLocaltion: 1,
    keySearchLocaltion: '',
    currentUserId:0
};

CmsShop.Home.InitMap = function () {
    var p = this;

    var $maps = $('#maps');
    var $widgetbodyuser = $('#widget-body-user');
    var $widgetbodymap = $('#widget-body-map');
    $maps.css({ height: $(window).height() - 95 });
    $widgetbodyuser.css({ height: $(window).height() - 95 });
    $widgetbodymap.css({ height: $(window).height() - 95 });    

    var myLatLng = new google.maps.LatLng(21.0026, 105.8056);
    var mapOptions = {
        zoom: 12,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: true
    };
    var map = new google.maps.Map($maps[0],mapOptions);    

    var image = {
        url: '/assets/img/favicon.png',
        size: new google.maps.Size(20, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32)
    }
    image = '';    

    var circle = new google.maps.Circle({
        strokeColor: '#2dc3e8',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#2dc3e8',
        fillOpacity: 0.35,
        center: myLatLng,
        radius: Math.sqrt(500) * 100
    });
    circle.setMap(map);    

    p.AddMarker(myLatLng, '', 'VP VCCORP', image, map);

    p.GetAllAccount(map);    
};

CmsShop.Home.AddMarker = function (location, label, title, image, map) {
    var p = this;

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

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        infowindow.open(map, marker);

    });
    if (title != 'VP VCCORP')
        p.markers.push(marker);
};

CmsShop.Home.SetMapOnAll = function(map) {
    var p = this;

    for (var i = 0; i < p.markers.length; i++) {
        p.markers[i].setMap(map);
    }
};

CmsShop.Home.GetAllAccount = function(map) {
    var p = this;    

    var dataparam = { type: p.type, keySearch: p.keySearch, pageIndex: p.pageIndex, pageSize: p.pageSize };

    $.ajax({
        type: "GET",
        url: "/Account/ListAllPaging",
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
                    p.GetAllAccount(map);
                });

            } else {
                $("#listAllAccount").html('');
            }
            //logisticJs.stopLoading();            
        },
        error: function(status) {
            //logisticJs.stopLoading();
        }
    });
};

CmsShop.Home.RegisterEvents = function(map) {
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

    $('table #listAllAccount tr').off('click').on('click', function() {

        $('table #listAllAccount tr[data-active="1"]').css({ 'background-color': '#fff' });
        $('table #listAllAccount tr[data-active="1"]').attr('data-active', 0);

        var $this = $(this);
        $this.css({ 'background-color': '#f5f5f5' });
        $this.attr('data-active', 1);

        $('#btnAddLocaltionByUser').attr('data-user', $this.attr('data-id'));
        p.currentUserId = $this.attr('data-id');

        p.SetMapOnAll(null);        

        p.LoadAllLocaltionByUser($this.attr('data-id'), function (data) {
            $.each(data, function (i, item) {
                var myLatLng = { lat: parseFloat(item.Lag), lng: parseFloat(item.Lng) };
                p.AddMarker(myLatLng, '', item.Name, 'default', map);
            });
        });
    });

    $("#txtSearch").off("change keydown paste input").on("change keydown paste input", function () {
        p.keySearch = $("#txtSearch").val();
        if (p.keySearch == "" || p.keySearch.length > 2) {
            p.pageIndex = 1;
            p.GetAllAccount(map);
        }
    });

    $("#txtSearchLocaltion").off("change keydown paste input").on("change keydown paste input", function () {
        p.keySearchLocaltion = $("#txtSearchLocaltion").val();
        if (p.keySearchLocaltion == "" || p.keySearchLocaltion.length > 2) {
            p.pageIndexLocaltion = 1;
            p.LoadAllLocaltionByUser(p.currentUserId, function () {
                
            });
        }
    });

    $('#btnAddLocaltionByUser').off('click').on('click', function () {
        var $this = $(this);
        if (p.currentUserId != 0) {
            bootbox.dialog({
                message: $("#myModalLocaltion").html(),
                title: "Danh sách các địa chỉ",
                className: "modal-primary",
                buttons: {
                    success: {
                        label: "Ok",
                        className: "btn-info",
                        callback: function() {}
                    },
                    "Hủy bỏ": {
                        className: "btn-default",
                        callback: function() {}
                    }
                }
            });
        } else {
            logisticJs.msgWarning({
                text: "Chọn tài khoản trước khi thêm địa điểm."
            });
        }
    });
};

CmsShop.Home.LoadAllLocaltionByUser = function (userId, callback) {
    var p = this;

    var dataparam = {userId:userId, keySearch: p.keySearchLocaltion, pageIndex: p.pageIndexLocaltion, pageSize: p.pageSizeLocaltion };

    $.ajax({
        type: "GET",
        url: "/Localtion/ListAllPaging",
        data: dataparam,
        dataType: "json",
        beforeSend: function () {
            //logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status == true && response.totalCount > 0) {
                var template = $("#package-data-localtion").html();
                var render = "";
                $.each(response.Data, function (i, item) {                                        
                    render += Mustache.render(template, {
                        stt: i + 1, id: item.Id, name: item.Name, phone: item.Phone,address: item.Address
                    });                    
                });
                if (render != undefined) {
                    $("#listAllLocaltion").html(render);
                }
                p.WrapPagingLocaltion(response.totalCount, '#btnNextLocaltion', '#btnPreviousLocaltion', response.totalRow, function () {
                    p.LoadAllLocaltion(userId, function () {
                        //p.RegisterEvents();
                    });
                });

            } else {
                $("#listAllLocaltion").html('');
            }
            //logisticJs.stopLoading();

            if (typeof (callback) == "function") {
                callback(response.Data);
            }
        },
        error: function (status) {
            //logisticJs.stopLoading();
        }
    });
};

CmsShop.Home.WrapPaging = function (total, next, previous, recordCount, callBack) {
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

CmsShop.Home.WrapPagingLocaltion = function (total, next, previous, recordCount, callBack) {
    var p = this;

    var totalsize = Math.ceil(recordCount / p.pageSizeLocaltion);
    var pg = "";
    if (totalsize > 1)
        $('#pagerLocaltion').removeClass('hide');
    else
        $('#pagerLocaltion').addClass('hide');
    pg = logisticJs.paginate(p.pageIndexLocaltion, recordCount, p.pageSizeLocaltion);
    $('#pagerLocaltion').find('.pg').remove();
    $('.btnPreviousLocaltion').after(pg);
    $('#pagerLocaltion').find('.pg_' + p.pageIndexLocaltion).addClass('active');
    if (total >= p.pageSizeLocaltion) {
        $('.btnNextLocaltion').removeClass('disabled');
    } else {
        $('.btnNextLocaltion').addClass('disabled');
    }
    if (p.pageIndexLocaltion > 1) {
        $('.btnPreviousLocaltion').removeClass('disabled');
    } else {
        $('.btnPreviousLocaltion').addClass('disabled');
    }
    $(next).off('click').on('click', function () {
        if ($('.btnNextLocaltion').hasClass('disabled')) return false;
        p.pageIndexLocaltion++;
        setTimeout(callBack(), 200);
        return false;
    });
    $(previous).off('click').on('click', function () {
        if ($('.btnPreviousLocaltion').hasClass('disabled')) return false;
        p.pageIndexLocaltion--;
        setTimeout(callBack(), 200);
        return false;
    });

    $('#pagerLocaltion').find('.pg').off('click').on('click', function () {
        var curentPage = $(this).attr("data-page");
        p.pageIndexLocaltion = curentPage;
        $('#pagerLocaltion').find('.pg').removeClass('active');
        $(this).addClass('active');
        callBack();
    });
};