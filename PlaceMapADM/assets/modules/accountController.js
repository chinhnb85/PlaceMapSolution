if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.Account) == "undefined") CmsShop.Account = {};

CmsShop.Account = {
    pageSize: 10,
    pageIndex: 1,
    keySearch: '',
    type: 2
};

CmsShop.Account.Init = function () {
    var p = this;

    $("#sltTypeSearch").val(p.type);
    $("#txtBirthDay").datepicker({ format: 'dd/mm/yyyy' });

    $("#insert-account").validate({
        rules: {
            sltType: { valueNotEquals: "0" },
            txtUserName: { required: true },
            txtPassword: { required: true, minlength: 6 },
            txtDisplayName: { required: true }            
        },
        errorElement: "span",
        messages: {
            sltType: { valueNotEquals: "Chọn loại tài khoản" },
            txtUserName: {
                required: "Tên đăng nhập không được để trống"                
            },
            txtPassword: {
                required: "Mật khẩu không được để trống",
                minlength:"Mật khẩu phải có 6 ký tự trở lên"
            },
            txtDisplayName: {
                required: "Tên hiển thị không được để trống"
            }
        }
    });

    $.validator.addMethod("valueNotEquals", function (value, element, arg) {
        return arg != value;
    }, "Chọn loại tài khoản");


    p.LoadAllAccount(function () {
        p.RegisterEvents();
    });    
};

CmsShop.Account.RegisterEvents = function () {
    var p = this;
   
    $("#btnSaveAccount").off("click").on("click", function () {
        var $this = $(this);
        
        if ($("#insert-account").valid()) {
            p.AddNewAccount($this.attr('data-id'), '#insert-account');
        }        
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
        p.pageIndex = 1;
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
            p.EmptyAccount();
        } else {
            $('#insert-account').hide(500);
            $this.addClass('hideform').removeClass('showform').html('<i class="fa fa-plus"></i> Tạo tài khoản');
        }
    });
    $("#keySearch").off("change keydown paste input").on("change keydown paste input", function () {
        p.keySearch = $("#keySearch").val();
        if (p.keySearch == "" || p.keySearch.length > 2) {
            p.pageIndex = 1;            
            p.LoadAllAccount(function() {
                p.RegisterEvents();
            });
        }
    });
    $("#sltTypeSearch").off("change").on("change", function () {
        p.type = $("#sltTypeSearch").val();
        p.pageIndex = 1;
        p.LoadAllAccount(function () {
            p.RegisterEvents();
        });
    });
};

CmsShop.Account.AddNewAccount = function (id,form) {
    var p = this;

    $.ajax({
        type: "POST",
        url: "/Account/Add",
        data: $(form).serialize(),
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
                    text: response.message,
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
                $("#sltType").val(response.Data.Type);
                $("#txtUserName").val(response.Data.UserName);
                $("#txtUserName").prop("readonly", true);
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
                $("#btnSaveAccount").attr('data-id', response.Data.Id);
                $("#hdAccountId").val(response.Data.Id);

                $('html,body').animate({ scrollTop: 0 });
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

    var dataparam = {type:p.type, keySearch:p.keySearch, pageIndex: p.pageIndex, pageSize: p.pageSize };

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
                    $("#listAllAccount").html(render);
                }                
                p.WrapPaging(response.totalCount, '#btnNext', '#btnPrevious',response.totalRow, function () {
                    p.LoadAllAccount(function () {
                        p.RegisterEvents();
                    });
                });

            } else {
                $("#listAllAccount").html('');
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
    
    $("#sltType").val(2);
    $("#txtUserName").val('');
    $("#txtUserName").prop("readonly", false);
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