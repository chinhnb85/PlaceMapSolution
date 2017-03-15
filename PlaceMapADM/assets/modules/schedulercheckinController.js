if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.SchedulerCheckin) == "undefined") CmsShop.SchedulerCheckin = {};

CmsShop.SchedulerCheckin = {        
    type: 2,    
    userId: 0,
    startDate: logisticJs.dateNow(),
    endDate: logisticJs.dateNow(),    
    localtions: []
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

    scheduler.locale.labels.section_account = "Mã tài khoản: ";
    scheduler.locale.labels.section_localtion = "Chọn địa điểm: ";
    scheduler.config.lightbox.sections = [
        { name: "account", height: 30, map_to: "account_id", type: "textarea", default_value: p.userId + "" },
        { name: "localtion", options: p.localtions, map_to: "localtion_id", type: "combo", image_path: "../common/dhtmlxCombo/imgs/", height: 30, filtering: true },
        { name: "description", height: 100, map_to: "text", type: "textarea", focus: true },
        { name: "time", height: 72, type: "time", map_to: "auto" }
    ];
    scheduler.attachEvent("onLightbox", function () {
        var section = scheduler.formSection("account");
        section.control.disabled = true;
        section.control.value = p.userId + "";
    });    

    scheduler.config.xml_date = "%Y-%m-%d %H:%i";
    scheduler.config.prevent_cache = true;
    scheduler.config.show_loading = true;
    scheduler.init('scheduler_here', new Date(), "month");
    
    //Saving data
    var dp = new dataProcessor("/SchedulerCheckin/UpdateData");
    dp.init(scheduler);
    dp.attachEvent("onAfterUpdateFinish", function () {
        //load data vào lịch    
        scheduler.clearAll();
        var param = "userId=" + p.userId + "&startDate=" + p.startDate + "&endDate=" + p.endDate;
        scheduler.load("/SchedulerCheckin/GetListScheduleCheckinByUserId?" + param, "json");
    })
   
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
        p.LoadAllLocaltionByUser();                               

        //load data vào lịch    
        scheduler.clearAll();
        var param = "userId=" + p.userId + "&startDate=" + p.startDate + "&endDate=" + p.endDate;
        scheduler.load("/SchedulerCheckin/GetListScheduleCheckinByUserId?"+param,"json");        
    });       
};

CmsShop.SchedulerCheckin.LoadAllLocaltionByUser = function (callback) {
    var p = this;

    var dataparam = { accountId: p.userId, parentId: 0, provinceId: 0, keySearch: '', pageIndex: 1, pageSize: 1000 };

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
                p.localtions.length = 0;
                $.each(response.Data, function (i, item) {                                        
                    p.localtions.push({key: item.Id, label: item.Name});               
                });                                              
            }

            logisticJs.stopLoading();

            if (typeof (callback) == "function") {
                callback(p.localtions);
            }
        },
        error: function (status) {
            logisticJs.stopLoading();
        }
    });
};

$(function () {
    CmsShop.SchedulerCheckin.Init();
});