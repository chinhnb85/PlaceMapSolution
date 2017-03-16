if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.Statistic) == "undefined") CmsShop.Statistic = {};

CmsShop.Statistic = {
    pageSize: 20,
    pageIndex: 1,
    startDate: logisticJs.startDateNow(),
    endDate: logisticJs.endDateNow()
};

CmsShop.Statistic.Init = function () {
    var p = this;

    logisticJs.activeMenuSidebar('/Statistic');

    $("#sltPageSize").val(p.pageSize);
    $("#txtDatetimeStart").val(p.startDate).datepicker({ format: 'dd/mm/yyyy' });
    $("#txtDatetimeEnd").val(p.endDate).datepicker({ format: 'dd/mm/yyyy' });

    p.LoadAllStatistic(function () {
        p.RegisterEvents();
    });    
};

CmsShop.Statistic.RegisterEvents = function () {
    var p = this;
    
    $("#sltPageSize").off("change").on("change", function () {
        p.pageSize = $("#sltPageSize").val();
        p.pageIndex = 1;
        p.startDate = $("#txtDatetimeStart").val();
        p.endDate = $("#txtDatetimeEnd").val();
        p.LoadAllStatistic(function () {
            p.RegisterEvents();
        });
    });

    $("#btnSearch").off("click").on("click", function () {        
        p.startDate = $("#txtDatetimeStart").val();
        p.endDate = $("#txtDatetimeEnd").val();
        p.pageIndex = 1;

        p.LoadAllStatistic(function () {
            p.RegisterEvents();
        });
    });
        
    $("#btnExportStatistic").off("click").on("click", function () {
        p.ExportExcelAllStatistic();
    });

};

CmsShop.Statistic.LoadAllStatistic = function (callback) {
    var p = this;

    var dataparam = { startDate: p.startDate, endDate: p.endDate, pageIndex: p.pageIndex, pageSize: p.pageSize };

    $.ajax({
        type: "GET",
        url: "/Statistic/ListStatisticPaging",
        data: dataparam,
        dataType: "json",
        beforeSend: function () {
            logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status == true && response.totalCount > 0) {                
                var template = $("#package-data").html();
                var render = "";            
                
                $.each(response.Data, function (i, item) {
                                        
                    render += Mustache.render(template, {
                        stt: i+1, userName: item.UserName, 
                        fullName: item.FullName, sumAll: item.SumAll,
                        sumCheckInMonth: item.SumCheckInMonth, fullMinCheckInMonth: item.FullMinCheckInMonth
                    });                    
                });
                if (render != undefined) {
                    $("#listAllStatistic").html(render);
                }                
                p.WrapPaging(response.totalCount, '#btnNext', '#btnPrevious',response.totalRow, function () {
                    p.LoadAllStatistic(function () {
                        p.RegisterEvents();
                    });
                });

            } else {
                $("#listAllStatistic").html('');
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

CmsShop.Statistic.ExportExcelAllStatistic = function (callback) {
    var p = this;

    var dataparam = { startDate: p.startDate, endDate: p.endDate };

    $.ajax({
        type: "GET",
        url: "/Statistic/ExportExcelAllStatistic",
        data: dataparam,
        dataType: "json",
        beforeSend: function () {
            logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status == true) {
                //logisticJs.msgShowSuccess({ titleHeader: 'Export excel thành công.' });
                window.location.href = response.Data;
            } else {
                logisticJs.msgWarning({
                    text: "Việc Export excel gặp lỗi.</br>" + response.Data,
                    modal: true
                });
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

CmsShop.Statistic.WrapPaging = function (total, next, previous, recordCount, callBack) {
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
    CmsShop.Statistic.Init();
});