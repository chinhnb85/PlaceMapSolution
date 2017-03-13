if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.SchedulerCheckin) == "undefined") CmsShop.SchedulerCheckin = {};

CmsShop.SchedulerCheckin = {        
    type: 2,    
    userId: 0    
};

CmsShop.SchedulerCheckin.Init = function () {
    var p = this;    

    logisticJs.activeMenuSidebar('/SchedulerCheckin');

    p.LoadAllAccountByType(function () {
        $("#sltAccount").select2();                     
    });

    var $widgetbodyscheduler = $('#widget-body-scheduler');
    $widgetbodyscheduler.css({ height: $(window).height() - 95 });
    var $widgetbodyschedulerhere = $('#scheduler_here');
    $widgetbodyschedulerhere.css({ height: $widgetbodyscheduler.height()-60 });

    scheduler.locale = {
        date: {
            month_full: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
            month_short: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            day_full: ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 5", "Thứ 7"],
            day_short: ["cn", "2", "3", "4", "5", "6", "7"]
        },
        labels: {
            dhx_cal_today_button: "Hôm nay",
            day_tab: "Ngày",
            week_tab: "Tuần",
            month_tab: "Tháng",
            new_event: "Sự kiện mới",
            icon_save: "Lưu",
            icon_cancel: "Hủy bỏ",
            icon_details: "Chi tiết",
            icon_edit: "Sửa",
            icon_delete: "Xóa",
            confirm_closing: "Bạn có thực sự muốn đóng lại?", //Your changes will be lost, are your sure?
            confirm_deleting: "Bạn có muốn xóa sự kiện này không?",
            section_description: "Mô tả",
            section_time: "Thời gian"
        }
    }
    scheduler.config.xml_date = "%Y-%m-%d %H:%i";
    scheduler.config.prevent_cache = true;
    scheduler.init('scheduler_here', new Date(), "month");

    p.RegisterEvents();
};

CmsShop.SchedulerCheckin.LoadAllAccountByType = function (callback) {

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

CmsShop.SchedulerCheckin.RegisterEvents = function() {
    var p = this;

    $("#sltAccount").off("change").on("change", function () {        
        p.userId = $("#sltAccount").val();

        //load data vào lịch
        scheduler.load("data/connector.php");

        //Saving data
        var dp = new dataProcessor("data/connector.php");
        dp.init(scheduler);

        //p.LoadAllLocaltionByUser(function () {
        //    p.RegisterEvents();
        //});
    });    

    $('#btnUpdateLocaltionByUser').off('click').on('click', function () {        
    });    
};

CmsShop.SchedulerCheckin.LoadAllLocaltionByUser = function (callback) {
    var p = this;

    var dataparam = { accountId: p.userId, parentId: p.parentId, provinceId: p.provinceId, keySearch: p.keySearch, pageIndex: p.pageIndex, pageSize: p.pageSize };

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
                    var avatar = "/assets/img/avatars/no-avatar.gif";
                    if (item.Avatar != "" && item.Avatar!=null) {
                        avatar = item.Avatar;
                    }
                    render += Mustache.render(template, {
                        stt: i + 1, id: item.Id, name: item.Name, avatar: avatar
                    });                    
                });
                if (render != undefined) {
                    $("#listAllLocaltionA").html(render);
                }
                p.WrapPaging(response.totalCount, '#btnNextLocaltion', '#btnPreviousLocaltion', response.totalRow, function () {                    
                    p.LoadAllLocaltionByUser(function() {                        
                        p.RegisterEvents();
                    });
                });
                
                $(".viewdetail").off("click").on("click", function () {
                    var $this = $(this);
                    p.ViewDetailLocaltionNow($this.attr('data-id'), function () {
                        $('#myModalLocaltionDetail').modal('show');
                    });
                });

            } else {
                $("#listAllLocaltionA").html('');
                p.WrapPagingA(0, '#btnNextLocaltion', '#btnPreviousLocaltion', 0);
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

CmsShop.SchedulerCheckin.WrapPaging = function (total, next, previous, recordCount, callBack) {
    var p = this;

    var totalsize = Math.ceil(recordCount / p.pageSizeA);
    var pg = "";
    if (totalsize > 1)
        $('#pagerLocaltion').removeClass('hide');
    else
        $('#pagerLocaltion').addClass('hide');
    pg = logisticJs.paginate(p.pageIndexA, recordCount, p.pageSizeA);
    $('#pagerLocaltion').find('.pg').remove();
    $('.btnPreviousLocaltion').after(pg);
    $('#pagerLocaltion').find('.pg_' + p.pageIndexA).addClass('active');
    if (total >= p.pageSizeA) {
        $('.btnNextLocaltion').removeClass('disabled');
    } else {
        $('.btnNextLocaltion').addClass('disabled');
    }
    if (p.pageIndexA > 1) {
        $('.btnPreviousLocaltion').removeClass('disabled');
    } else {
        $('.btnPreviousLocaltion').addClass('disabled');
    }
    $(next).off('click').on('click', function () {
        if ($('.btnNextLocaltion').hasClass('disabled')) return false;
        p.pageIndexA++;
        setTimeout(callBack(), 200);
        return false;
    });
    $(previous).off('click').on('click', function () {
        if ($('.btnPreviousLocaltion').hasClass('disabled')) return false;
        p.pageIndexA--;
        setTimeout(callBack(), 200);
        return false;
    });

    $('#pagerLocaltion').find('.pg').off('click').on('click', function () {
        var curentPage = $(this).attr("data-page");
        p.pageIndexA = curentPage;
        $('#pagerLocaltion').find('.pg').removeClass('active');
        $(this).addClass('active');
        callBack();
    });
};

CmsShop.SchedulerCheckin.ViewDetailLocaltionNow = function (id, callback) {
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

$(function () {
    CmsShop.SchedulerCheckin.Init();
});