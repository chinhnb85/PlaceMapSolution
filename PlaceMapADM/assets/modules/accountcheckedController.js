if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.AccountChecked) == "undefined") CmsShop.AccountChecked = {};

CmsShop.AccountChecked = {
    pageSize: 10,
    pageIndex: 1,
    accountId: 0,
    startDate: logisticJs.dateNow(),
    endDate: logisticJs.dateNow(),
    params:[]
};

CmsShop.AccountChecked.Init = function () {
    var p = this;

    logisticJs.activeMenuSidebar('/AccountChecked');

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

    p.GetAllAccountByType(function () {
        p.accountId = (p.params.accountId == undefined) ? 0 : p.params.accountId;
        $("#sltAccountSearch").val(p.accountId).select2();
    });

    p.LoadAllAccountChecked(function () {
        p.RegisterEvents();
    });    
};

CmsShop.AccountChecked.GetAllAccountByType = function (callback) {
    var p = this;

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
                        id: item.Id,
                        name: item.DisplayName
                    });
                });
                if (render != undefined) {
                    $("#sltAccountSearch").append(render);
                }
                p.RegisterEvents();
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

CmsShop.AccountChecked.RegisterEvents = function () {
    var p = this;
       
    $("#sltPageSize").off("change").on("change", function () {
        p.pageSize = $("#sltPageSize").val();
        p.pageIndex = 1;
        p.accountId = $("#sltAccountSearch").val();
        p.startDate = $("#txtDatetimeStartSearch").val();
        p.endDate = $("#txtDatetimeEndSearch").val();

        p.LoadAllAccountChecked(function () {
            p.RegisterEvents();
        });
    });    
   
    $("#btnSearch").off("click").on("click", function () {
        p.accountId = $("#sltAccountSearch").val();
        p.startDate = $("#txtDatetimeStartSearch").val();
        p.endDate = $("#txtDatetimeEndSearch").val();
        p.pageIndex = 1;

        p.LoadAllAccountChecked(function () {
            p.RegisterEvents();
        });
    });
       
};

CmsShop.AccountChecked.LoadAllAccountChecked = function (callback) {
    var p = this;

    var dataparam = {accountId:p.accountId,startDate:p.startDate,endDate:p.endDate,pageIndex: p.pageIndex, pageSize: p.pageSize };

    $.ajax({
        type: "GET",
        url: "/AccountChecked/LocaltionAccountCheckListAllByAccountId",
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
                        stt: i + 1, id: item.Id, name: item.Name, address: item.Address, checkDate: checkDate
                    });                    
                });
                if (render != undefined) {
                    $("#listAllAccountChecked").html(render);
                }                
                p.WrapPaging(response.totalCount, '#btnNext', '#btnPrevious',response.totalRow, function () {
                    p.LoadAllAccountChecked(function () {
                        p.RegisterEvents();
                    });
                });

            } else {
                $("#listAllAccountChecked").html('');
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

CmsShop.AccountChecked.WrapPaging = function (total, next, previous, RecordCount, callBack) {
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
    CmsShop.AccountChecked.Init();
});