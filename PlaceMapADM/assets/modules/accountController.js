﻿if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.Localtion) == "undefined") CmsShop.Localtion = {};

CmsShop.Localtion = {
    pageSize: 10,
    pageIndex: 1,
    keySearch:''
};

CmsShop.Localtion.Init = function () {
    var p = this;

    $("#txtBirthDay").datepicker({ format: 'dd/mm/yyyy'});

    p.LoadAllLocaltion(function () {
        p.RegisterEvents();
    });    
};

CmsShop.Localtion.RegisterEvents = function () {
    var p = this;

    $("#btnSaveLocaltion").off("click").on("click", function () {
        var $this = $(this);
        p.AddNewLocaltion($this.attr('data-id'));
    });
    $(".edit").off("click").on("click", function () {
        var $this = $(this);
        if ($('#btnAddNewLocaltion').hasClass('hideform')) {
            $('#insert-Localtion').show(500);
            $('#btnAddNewLocaltion').addClass('showform').removeClass('hideform').html('<i class="fa fa-minus"></i> Đóng');            
        }
        p.EditLocaltion($this.attr('data-id'));
    });
    $(".delete").off("click").on("click", function () {
        var $this = $(this);
        p.DeleteLocaltion($this.attr('data-id'));
    });
    $("#btnCancel").off("click").on("click", function () {
        p.EmptyLocaltion();
    });
    $("#sltPageSize").off("change").on("change", function () {
        p.pageSize = $("#sltPageSize").val();
        p.pageIndex = 1;
        p.LoadAllLocaltion(function () {
            p.RegisterEvents();
        });
    });
    $(".checkbox-slider").off("click").on("click", function () {
        var $this = $(this);
        p.UpdateStatusLocaltion($this.attr('data-id'));
    });
    $("#btnAddNewLocaltion").off("click").on("click", function () {
        var $this = $(this);
        if ($this.hasClass('hideform')) {
            $('#insert-Localtion').show(500);
            $this.addClass('showform').removeClass('hideform').html('<i class="fa fa-minus"></i> Đóng');
            p.EmptyLocaltion();
        } else {
            $('#insert-Localtion').hide(500);
            $this.addClass('hideform').removeClass('showform').html('<i class="fa fa-plus"></i> Tạo tài khoản');
        }
    });
    $("#keySearch").off("change keydown paste input").on("change keydown paste input", function () {
        p.keySearch = $("#keySearch").val();
        if (p.keySearch == "" || p.keySearch.length > 2) {
            p.pageIndex = 1;            
            p.LoadAllLocaltion(function() {
                p.RegisterEvents();
            });
        }
    });
};

CmsShop.Localtion.AddNewLocaltion = function (id) {
    var p = this;
        
    $.ajax({
        type: "POST",
        url: "/Localtion/Add",
        data: $("#insert-Localtion").serialize(),
        dataType: "json",
        beforeSend: function () {
            //logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status) {
                logisticJs.msgShowSuccess({ titleHeader: 'Lưu thành công.' });
                p.EmptyLocaltion();
                p.pageIndex = 1;
                p.LoadAllLocaltion(function () {
                    p.RegisterEvents();
                });
            } else {                
                logisticJs.msgWarning({
                    text: "Việc lưu tài khoản gặp lỗi.",
                    modal: true
                });                
            }
            //logisticJs.stopLoading();
        },
        error: function (status) {
            //logisticJs.stopLoading();
        }
    });
};

CmsShop.Localtion.EditLocaltion = function (id) {
    var p = this;    

    $.ajax({
        type: "GET",
        url: "/Localtion/GetLocaltionById",
        data: { Id:id },
        dataType: "json",
        beforeSend: function () {
            //logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status) {
                $("#txtUserName").val(response.Data.UserName);
                $("#txtPassword").val(response.Data.Password);
                $("#txtDisplayName").val(response.Data.DisplayName);
                $("#txtEmail").val(response.Data.Email);
                $("#txtPhone").val(response.Data.Phone);
                var birthday = "";
                if (response.Data.BirthDay!=null) {
                    birthday = logisticJs.convertDatetimeDMY(response.Data.BirthDay);
                }
                $("#txtBirthDay").val(birthday);
                $("#txtAddress").val(response.Data.Address);
                $("#cbxStatus").prop('checked', response.Data.Status);
                $("#btnSaveLocaltion").attr('data-id', response.Data.Id);
                $("#hdLocaltionId").val(response.Data.Id);

                $('html,body').animate({ scrollTop: 0 });
            }
            //logisticJs.stopLoading();
        },
        error: function (status) {
            //logisticJs.stopLoading();
        }
    });
};

CmsShop.Localtion.DeleteLocaltion = function (id) {
    var p = this;
    logisticJs.msgConfirm({        
        text: 'Bạn có chắc muốn xóa tài khoản này?'
    }, function () {
        $.ajax({
            type: "GET",
            url: "/Localtion/Delete",
            data: { Id: id },
            dataType: "json",
            beforeSend: function () {
                //logisticJs.startLoading();
            },
            success: function (response) {
                if (response.status) {                
                    p.LoadAllLocaltion(function () {
                        p.RegisterEvents();
                    });
                }
                //logisticJs.stopLoading();
            },
            error: function (status) {
                //logisticJs.stopLoading();
            }
        });
    });    
};

CmsShop.Localtion.UpdateStatusLocaltion = function (id) {
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
                
            }
            //logisticJs.stopLoading();
        },
        error: function (status) {
            //logisticJs.stopLoading();
        }
    });
};

CmsShop.Localtion.LoadAllLocaltion = function (callback) {
    var p = this;

    var dataparam = { keySearch:p.keySearch, pageIndex: p.pageIndex, pageSize: p.pageSize };

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
                var template = $("#package-data").html();
                var render = "";                
                $.each(response.Data, function (i, item) {
                    var statusacc = "";
                    if (item.Status) {
                        statusacc = "checked";
                    }
                    var createddate = "";
                    if (item.CreatedDate != null) {
                        createddate = logisticJs.convertDatetimeDMY(item.CreatedDate);
                    }
                    render += Mustache.render(template, {
                        stt: i+1, id: item.Id, displayName: item.DisplayName, phone: item.Phone, 
                        email: item.Email, statusAcc: statusacc, createdDate: createddate
                    });                    
                });
                if (render != undefined) {
                    $("#listAllLocaltion").html(render);
                }                
                p.WrapPaging(response.totalCount, '#btnNext', '#btnPrevious',response.totalRow, function () {
                    p.LoadAllLocaltion(function () {
                        p.RegisterEvents();
                    });
                });

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

CmsShop.Localtion.WrapPaging = function (total, next, previous, RecordCount, callBack) {
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

CmsShop.Localtion.EmptyLocaltion = function() {
    var p = this;
    $("#txtUserName").val('');
    $("#txtPassword").val('');
    $("#txtDisplayName").val('');
    $("#txtEmail").val('');
    $("#txtPhone").val('');
    $("#txtBirthDay").val('');
    $("#txtAddress").val('');
    $("#cbxStatus").prop('checked', false);
    $("#btnSaveLocaltion").attr('data-id', 0);
    $("#hdLocaltionId").val(0);
};

$(function(){
    CmsShop.Localtion.Init();
});