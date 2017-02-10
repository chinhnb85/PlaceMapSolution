if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.LocaltionCheckin) == "undefined") CmsShop.LocaltionCheckin = {};

CmsShop.LocaltionCheckin = {
    pageSize: 10,
    pageIndex: 1,
    localtionId: 0,
    startDate: logisticJs.dateNow(),
    endDate: logisticJs.dateNow(),
    params:[]
};

CmsShop.LocaltionCheckin.Init = function () {
    var p = this;

    logisticJs.activeMenuSidebar('/LocaltionCheckin');

    if (location.search) {
        var parts = location.search.substring(1).split('&');

        for (var i = 0; i < parts.length; i++) {
            var nv = parts[i].split('=');
            if (!nv[0]) continue;
            p.params[nv[0]] = nv[1] || true;
        }
    }

    $("#txtDatetimeStartSearch").val(p.startDate).datepicker({ format: 'dd/mm/yyyy' });
    $("#txtDatetimeEndSearch").val(p.endDate).datepicker({ format: 'dd/mm/yyyy' });

    p.GetAllLocaltion(function () {
        p.localtionId = (p.params.localtionId == undefined) ? 0 : p.params.localtionId;
        $("#sltLocaltionSearch").val(p.localtionId).select2();
    });

    p.LoadAllLocaltionCheckin(function () {
        p.RegisterEvents();
    });    
};

CmsShop.LocaltionCheckin.GetAllLocaltion = function (callback) {
    var p = this;

    var dataparam = { };

    $.ajax({
        type: "GET",
        url: "/Localtion/ListAll",
        data: dataparam,
        dataType: "json",
        beforeSend: function () {
            logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status == true && response.totalCount > 0) {
                var template = $("#data-list-localtion").html();
                var render = "";
                $.each(response.Data, function (i, item) {
                    render += Mustache.render(template, {
                        id: item.Id,
                        name: item.Name
                    });
                });
                if (render != undefined) {
                    $("#sltLocaltionSearch").append(render);
                }
                p.RegisterEvents();
            }
            logisticJs.stopLoading();  
            if (typeof (callback) == "function") {
                callback();
            }
        },
        error: function (status) {
            logisticJs.stopLoading();
        }
    });
};

CmsShop.LocaltionCheckin.RegisterEvents = function () {
    var p = this;
       
    $("#sltPageSize").off("change").on("change", function () {
        p.pageSize = $("#sltPageSize").val();
        p.pageIndex = 1;
        p.localtionId = $("#sltLocaltionSearch").val();
        p.startDate = $("#txtDatetimeStartSearch").val();
        p.endDate = $("#txtDatetimeEndSearch").val();

        p.LoadAllLocaltionCheckin(function () {
            p.RegisterEvents();
        });
    });    
   
    $("#btnSearch").off("click").on("click", function () {
        p.localtionId = $("#sltLocaltionSearch").val();
        p.startDate = $("#txtDatetimeStartSearch").val();
        p.endDate = $("#txtDatetimeEndSearch").val();
        p.pageIndex = 1;

        p.LoadAllLocaltionCheckin(function () {
            p.RegisterEvents();
        });
    });
       
};

CmsShop.LocaltionCheckin.LoadAllLocaltionCheckin = function (callback) {
    var p = this;

    var dataparam = {localtionId:p.localtionId,startDate:p.startDate,endDate:p.endDate,pageIndex: p.pageIndex, pageSize: p.pageSize };

    $.ajax({
        type: "GET",
        url: "/LocaltionCheckin/LocaltionAccountCheckListAllByLocaltionId",
        data: dataparam,
        dataType: "json",
        beforeSend: function () {
            //logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status == true && response.totalCount > 0) {                
                var template = $("#package-data").html();
                var render = "";                
                $.each(response.Data, function (i, item) {                    
                    var checkDate = "";
                    if (item.CheckDate != null) {
                        checkDate = logisticJs.dateFormatJson2(item.CheckDate);
                    }
                    render += Mustache.render(template, {
                        stt: i + 1, id: item.Id, name: item.Name,phone:item.Phone, address: item.Address, checkDate: checkDate
                    });                    
                });
                if (render != undefined) {
                    $("#listAllLocaltionCheckin").html(render);
                }                
                p.WrapPaging(response.totalCount, '#btnNext', '#btnPrevious',response.totalRow, function () {
                    p.LoadAllLocaltionCheckin(function () {
                        p.RegisterEvents();
                    });
                });

            } else {
                $("#listAllLocaltionCheckin").html('');
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

CmsShop.LocaltionCheckin.WrapPaging = function (total, next, previous, RecordCount, callBack) {
    var p = this;

    var size = p.pageIndex * p.pageSize;
    var Totalsize = Math.ceil(RecordCount / p.pageSize);
    var page = 0;
    var pg = "";
    if (Totalsize > 1)
        $('#pager').removeClass('hide');
    else
        $('#pager').addClass('hide');
    pg = logisticJs.paginate(p.pageIndex, RecordCount, p.pageSize);
    $('#pager').find('.pg').remove();
    $('.btnPrevious').after(pg);
    $('.pg_' + p.pageIndex).addClass('active');
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

    $('.pg').off('click').on('click', function () {
        var curentPage = $(this).attr("data-page");
        p.pageIndex = curentPage;
        $('.pg').removeClass('active');
        $(this).addClass('active');
        callBack();
    });
};

$(function(){
    CmsShop.LocaltionCheckin.Init();
});