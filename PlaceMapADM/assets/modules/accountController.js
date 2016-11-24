if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.Account) == "undefined") CmsShop.Account = {};

CmsShop.Account = {
    pageSize: 10,
    pageIndex: 1
};

CmsShop.Account.Init = function () {
    var p = this;

    $("#txtBirthDay").datepicker({ format: 'dd/mm/yyyy'});

    p.LoadAllAccount(function () {
        p.RegisterEvents();
    });    
};

CmsShop.Account.RegisterEvents = function () {
    var p = this;

    $("#btnSaveAccount").off("click").on("click", function () {
        var $this = $(this);
        p.AddNewAccount($this.attr('data-id'));
    });
    $(".edit").off("click").on("click", function () {
        var $this = $(this);
        if ($('#btnAddNewAccount').hasClass('hideform')) {
            $('#insert-account').show(500);
            $('#btnAddNewAccount').addClass('showform').removeClass('hideform').html('<i class="fa fa-minus"></i> Đóng');
        }
        p.EditAccount($this.attr('data-id'));
    });
    $(".delete").off("click").on("click", function () {
        var $this = $(this);
        p.DeleteAccount($this.attr('data-id'));
    });
    $("#btnCancel").off("click").on("click", function () {
        p.EmptyAccount();
    });
    $("#sltPageSize").off("change").on("change", function () {
        p.pageSize = $("#sltPageSize").val();
        p.LoadAllAccount(function () {
            p.RegisterEvents();
        });
    });
    $(".checkbox-slider").off("click").on("click", function () {
        var $this = $(this);
        p.UpdateStatusAccount($this.attr('data-id'));
    });
    $("#btnAddNewAccount").off("click").on("click", function () {
        var $this = $(this);
        if ($this.hasClass('hideform')) {
            $('#insert-account').show(500);
            $this.addClass('showform').removeClass('hideform').html('<i class="fa fa-minus"></i> Đóng');
        } else {
            $('#insert-account').hide(500);
            $this.addClass('hideform').removeClass('showform').html('<i class="fa fa-plus"></i> Thêm mới');
        }
    });
};

CmsShop.Account.AddNewAccount = function (id) {
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
        Id: id, UserName: username, Password: password, DisplayName: displayname, Email: email,
        Phone: phone, BirthDay: birthday, Address: address, Status: status
    };

    $.ajax({
        type: "POST",
        url: "/Account/Add",
        data: $("#insert-account").serialize(),
        dataType: "json",
        beforeSend: function () {
            //logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status) {
                logisticJs.msgShowSuccess({ titleHeader: 'Lưu thành công.' });
                p.EmptyAccount();
                p.pageIndex = 1;
                p.LoadAllAccount(function () {
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

CmsShop.Account.EditAccount = function (id) {
    var p = this;    

    $.ajax({
        type: "GET",
        url: "/Account/GetAccountById",
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
                $("#txtBirthDay").val(response.Data.BirthDay);
                $("#txtAddress").val(response.Data.Address);
                $("#cbxStatus").prop('checked', response.Data.Status);
                $("#btnSaveAccount").attr('data-id', response.Data.Id);
                $("#hdAccountId").val(response.Data.Id);
            }
            //logisticJs.stopLoading();
        },
        error: function (status) {
            //logisticJs.stopLoading();
        }
    });
};

CmsShop.Account.DeleteAccount = function (id) {
    var p = this;
    logisticJs.msgConfirm({        
        text: 'Bạn có chắc muốn xóa tài khoản này?'
    }, function () {
        $.ajax({
            type: "GET",
            url: "/Account/Delete",
            data: { Id: id },
            dataType: "json",
            beforeSend: function () {
                //logisticJs.startLoading();
            },
            success: function (response) {
                if (response.status) {                
                    p.LoadAllAccount(function () {
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

CmsShop.Account.UpdateStatusAccount = function (id) {
    var p = this;
    $.ajax({
        type: "GET",
        url: "/Account/UpdateStatus",
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

CmsShop.Account.LoadAllAccount = function (callback) {
    var p = this;

    var dataparam = { pageIndex: p.pageIndex, pageSize: p.pageSize };

    $.ajax({
        type: "GET",
        url: "/Account/ListAllPaging",
        data: dataparam,
        dataType: "json",
        beforeSend: function () {
            //logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status == true && response.totalCount > 0) {
                $("#listAllAccount").show();
                var template = $("#package-data").html();
                var render = "";                
                $.each(response.Data, function (i, item) {
                    var statusacc = "";
                    if (item.Status) {
                        statusacc = "checked";
                    }
                    render += Mustache.render(template, {
                        stt: i+1, id: item.Id, displayName: item.DisplayName, phone: item.Phone, email: item.Email,
                        statusAcc: statusacc, createdDate: logisticJs.convertDatetimeDMY(item.CreatedDate)
                    });                    
                });
                if (render != undefined) {
                    $("#listAllAccount").html(render);
                }                
                p.WrapPaging(response.totalCount, '#btnNext', '#btnPrevious',response.totalRow, function () {
                    p.LoadAllAccount(function () {
                        p.RegisterEvents();
                    });
                });

            } else {
                $("#listAllAccount").hide();
                logisticJs.msgWarning({
                    text: "Không có dữ liệu gốc!",
                    modal: true
                });
                p.WrapPaging(0, '#btnNext', '#btnPrevious',response.totalRow, function () {
                    p.LoadAllAccount(function () {
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
    $("#txtUserName").val('');
    $("#txtPassword").val('');
    $("#txtDisplayName").val('');
    $("#txtEmail").val('');
    $("#txtPhone").val('');
    $("#txtBirthDay").val('');
    $("#txtAddress").val('');
    $("#cbxStatus").prop('checked', false);
    $("#btnSaveAccount").attr('data-id', 0);
    $("#hdAccountId").val(0);
};

$(function(){
    CmsShop.Account.Init();
});