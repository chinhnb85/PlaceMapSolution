if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.Localtion) == "undefined") CmsShop.Localtion = {};

CmsShop.Localtion = {
    pageSize: 10,
    pageIndex: 1,
    keySearch:'',
    currentUserId: 0
};

CmsShop.Localtion.Init = function () {
    var p = this;

    logisticJs.activeMenuSidebar('/Localtion');

    $("#insert-localtion").validate({
        rules: {
            sltAccount: { valueNotEquals: "0" },
            txtName: { required: true },
            txtLag: { required: true, number: true },
            txtLng: { required: true, number: true }
        },
        errorElement: "span",
        messages: {
            sltAccount: { valueNotEquals: "Chọn tài khoản" },
            txtName: {
                required: "Nhập tên địa chỉ"
            },
            txtLag: {
                required: "Nhập kinh độ",
                number:"Chỉ cho phép nhập số"
            },
            txtLng: {
                required: "Nhập vĩ độ",
                number: "Chỉ cho phép nhập số"
            }
        }
    });

    $.validator.addMethod("valueNotEquals", function (value, element, arg) {
        return arg != value;
    }, "Chọn tài khoản");

    p.LoadAllAccountByType(function() {
        $("#sltAccount").select2();
    });

    p.LoadAllLocaltion(function () {
        p.RegisterEvents();
    });    
};

CmsShop.Localtion.RegisterEvents = function () {
    var p = this;

    $("#btnSaveLocaltion").off("click").on("click", function () {
        var $this = $(this);

        if ($("#insert-localtion").valid()) {
            p.AddNewLocaltion($this.attr('data-id'), "#insert-localtion");
        }
    });
    $(".edit").off("click").on("click", function () {
        var $this = $(this);
        if ($('#btnAddNewLocaltion').hasClass('hideform')) {
            $('#insert-localtion').show(500);
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
            $('#insert-localtion').show(500);
            $this.addClass('showform').removeClass('hideform').html('<i class="fa fa-minus"></i> Đóng');
            p.EmptyLocaltion();
        } else {
            $('#insert-localtion').hide(500);
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
    $('#btn_AvatarLocaltion').off('click').on('click', function () {
        $("#f_AvatarLocaltion").trigger('click');
        $("#f_AvatarLocaltion").off('change').on('change', function () {
            var file;
            if ((file = this.files[0])) {
                logisticJs.sendFile(file, 'Localtion', function (url) {                   
                    var avatar = "/assets/img/avatars/no-avatar.gif";
                    if (url != null && url!="") {
                        avatar = url;
                    }
                    $('#imgViewAvatar').attr('src', avatar);
                    $('#txtAvatar').val(avatar);
                });
            }
        });
    });
};

CmsShop.Localtion.AddNewLocaltion = function (id,form) {
    var p = this;
        
    $.ajax({
        type: "POST",
        url: "/Localtion/Add",
        data: $(form).serialize(),
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
                $("#sltAccount").val(response.Data.AccountId).trigger("change");
                $("#txtLag").val(response.Data.Lag);
                $("#txtLng").val(response.Data.Lng);
                $("#txtName").val(response.Data.Name);
                $("#txtEmail").val(response.Data.Email);
                $("#txtPhone").val(response.Data.Phone);                
                $("#txtAddress").val(response.Data.Address);
                var avatar = "/assets/img/avatars/no-avatar.gif";
                if (response.Data.Avatar != "" && response.Data.Avatar != null) {
                    avatar = response.Data.Avatar;
                }
                $("#txtAvatar").val(avatar);
                $('#imgViewAvatar').attr('src', avatar);
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

    var dataparam = {accountId:p.currentUserId, keySearch:p.keySearch, pageIndex: p.pageIndex, pageSize: p.pageSize };

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
                    var statusloc = "";
                    if (item.Status) {
                        statusloc = "checked";
                    }
                    var createddate = "";
                    if (item.CreatedDate != null) {
                        createddate = logisticJs.convertDatetimeDMY(item.CreatedDate);
                    }
                    var avatar = "/assets/img/avatars/no-avatar.gif";
                    if (item.Avatar != "" && item.Avatar!=null) {
                        avatar = item.Avatar;
                    }
                    render += Mustache.render(template, {
                        stt: i+1, id: item.Id, name: item.Name, userName: item.UserName, 
                        avatar: avatar, statusLoc: statusloc, createdDate: createddate,
                        accountId:item.AccountId,lag:item.Lag,lng:item.Lng
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

            } else {
                $("#listAllLocaltion").html('');
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

CmsShop.Localtion.WrapPaging = function (total, next, previous, recordCount, callBack) {
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

CmsShop.Localtion.EmptyLocaltion = function() {    
    $("#sltAccount").val(0).trigger('change');
    $("#txtName").val('');
    $("#txtLag").val('');
    $("#txtLng").val('');
    $("#txtEmail").val('');
    $("#txtPhone").val('');    
    $("#txtAddress").val('');
    $("#txtAvatar").val('');    
    $('#imgViewAvatar').attr('src', '/assets/img/avatars/no-avatar.gif');
    $("#cbxStatus").prop('checked', true);
    $("#btnSaveLocaltion").attr('data-id', 0);
    $("#hdLocaltionId").val(0);
};

CmsShop.Localtion.LoadAllAccountByType = function (callback) {

    var dataparam = { type: 2};

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

$(function(){
    CmsShop.Localtion.Init();
});