﻿if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.Account) == "undefined") CmsShop.Account = {};

CmsShop.Account = {
    pageSize: 5,
    pageIndex: 1
};

CmsShop.Account.Init = function () {
    var p = this;    

    p.LoadAllAccount();

    p.RegisterEvents();
};

CmsShop.Account.RegisterEvents = function () {
    var p = this;

    $("#btnAddNewAccount").off("click").on("click", function () {
        p.AddNewAccount();
    });
    $("#btnCancel").off("click").on("click", function () {
        p.EmptyAccount();
    });
};

CmsShop.Account.AddNewAccount = function () {
    var p = this;

    var username = $("#txtUserName").val();
    var password= $("#txtPassword").val();
    var displayname = $("#txtDisplayName").val();
    var email = $("#txtEmail").val();
    var phone = $("#txtPhone").val();
    var birthday = $("#txtBirthDay").val();
    var address = $("#txtAddress").val();
    var status = $("#cbxStatus").is(':checked');

    var account = {
        UserName: username, Password: password, DisplayName: displayname, Email: email,
        Phone: phone, BirthDay: birthday, Address: address, Status: status
    };

    $.ajax({
        type: "POST",
        url: "/Account/Add",
        data: $("#insert-account").serialize(),
        dataType: "json",
        beforeSend: function () {
            logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status) {
                p.EmptyAccount();
                p.pageIndex = 1;
                p.LoadAllAccount();
            } else {                
                logisticJs.msgWarning({
                    text: "Việc thêm tài khoản gặp lỗi.",
                    modal: true
                });                
            }
            logisticJs.stopLoading();
        },
        error: function (status) {
            logisticJs.stopLoading();
        }
    });
};

CmsShop.Account.LoadAllAccount = function (callback) {
    var p = this;

    var dataparam = { pageIndex: p.pageIndex, pageSize: p.pageSize };

    $.ajax({
        type: "GET",
        url: "/Account/ListAllPaging",
        data: dataparam,
        dataType: "json",
        beforeSend: function () {
            logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status == true && response.totalCount > 0) {
                $("#listAllAccount").show();
                var template = $("#package-data").html();
                var render = "";                
                $.each(response.Data, function (i, item) {
                    render += Mustache.render(template, {
                        id: item.Id, displayName: item.DisplayName, userName: item.UserName, email: item.Email,
                        deviceMobile: item.DeviceMobile, createdDate: logisticJs.dateFormatJson(item.CreatedDate)
                    });                    
                });
                if (render != undefined) {
                    $("#listAllAccount").html(render);
                }                
                p.WrapPaging(response.totalCount, '#btnNext', '#btnPrevious',response.totalRow, function () {
                    p.LoadAllAccount();
                });

            } else {
                $("#listAllAccount").hide();
                logisticJs.msgWarning({
                    text: "Không có dữ liệu gốc!",
                    modal: true
                });
                p.WrapPaging(0, '#btnNext', '#btnPrevious',response.totalRow, function () {
                    p.LoadAllAccount();
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

CmsShop.Account.WrapPaging = function (total, next, previous, RecordCount, callBack) {
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

CmsShop.Account.EmptyAccount = function() {
    var p = this;
};

$(function(){
    CmsShop.Account.Init();
});