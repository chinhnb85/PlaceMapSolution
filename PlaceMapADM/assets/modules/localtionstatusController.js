if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.LocaltionStatus) == "undefined") CmsShop.LocaltionStatus = {};

CmsShop.LocaltionStatus = {
    pageSize: 10,
    pageIndex: 1,
    keySearch: ''    
};

CmsShop.LocaltionStatus.Init = function () {
    var p = this;

    logisticJs.activeMenuSidebar('/LocaltionStatus');        

    $("#insert-localtionstatus").validate({
        rules: {            
            txtName: { required: true }         
        },
        errorElement: "span",
        messages: {            
            txtName: {
                required: "Tên không được để trống"                
            }
        }
    });    
    
    p.LoadAllLocaltionStatus(function () {
        p.RegisterEvents();
    });    
};

CmsShop.LocaltionStatus.RegisterEvents = function () {
    var p = this;
   
    $("#btnSaveLocaltionStatus").off("click").on("click", function () {
        var $this = $(this);
        
        if ($("#insert-localtionstatus").valid()) {
            p.AddNewLocaltionStatus($this.attr('data-id'), '#insert-localtionstatus');
        }        
    });
    $(".edit").off("click").on("click", function () {
        var $this = $(this);
        if ($('#btnAddNewLocaltionStatus').hasClass('hideform')) {
            $('#insert-localtionstatus').show(500);
            $('#btnAddNewLocaltionStatus').addClass('showform').removeClass('hideform').html('<i class="fa fa-minus"></i> Đóng');            
        }
        p.EditLocaltionStatus($this.attr('data-id'));
    });
    $(".delete").off("click").on("click", function () {
        var $this = $(this);
        p.DeleteLocaltionStatus($this.attr('data-id'));
    });
    $("#btnCancel").off("click").on("click", function () {
        p.EmptyLocaltionStatus();
    });
    $("#sltPageSize").off("change").on("change", function () {
        p.pageSize = $("#sltPageSize").val();
        p.pageIndex = 1;
        p.LoadAllLocaltionStatus(function () {
            p.RegisterEvents();
        });
    });
    
    $("#btnAddNewLocaltionStatus").off("click").on("click", function () {
        var $this = $(this);
        if ($this.hasClass('hideform')) {
            $('#insert-localtionstatus').show(500);
            $this.addClass('showform').removeClass('hideform').html('<i class="fa fa-minus"></i> Đóng');
            p.EmptyLocaltionStatus();
        } else {
            $('#insert-localtionstatus').hide(500);
            $this.addClass('hideform').removeClass('showform').html('<i class="fa fa-plus"></i> Thêm mới');
        }
    });
    $("#keySearch").off("change keydown paste input").on("change keydown paste input", function () {
        p.keySearch = $("#keySearch").val();
        if (p.keySearch == "" || p.keySearch.length > 2) {
            p.pageIndex = 1;            
            p.LoadAllLocaltionStatus(function() {
                p.RegisterEvents();
            });
        }
    });
    
};

CmsShop.LocaltionStatus.AddNewLocaltionStatus = function (id,form) {
    var p = this;

    $.ajax({
        type: "POST",
        url: "/LocaltionStatus/Add",
        data: $(form).serialize(),
        dataType: "json",
        beforeSend: function () {
            //logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status) {
                logisticJs.msgShowSuccess({ titleHeader: 'Lưu thành công.' });
                p.EmptyLocaltionStatus();
                p.pageIndex = 1;
                p.LoadAllLocaltionStatus(function () {
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
CmsShop.LocaltionStatus.EditLocaltionStatus = function (id) {
    var p = this;

    $.ajax({
        type: "GET",
        url: "/LocaltionStatus/GetLocaltionStatusById",
        data: { Id: id },
        dataType: "json",
        beforeSend: function () {
            //logisticJs.startLoading();
        },
        success: function (response) {
            if (response.status) {                
                $("#txtName").val(response.Data.Name);                
                $("#btnSaveLocaltionStatus").attr('data-id', response.Data.Id);
                $("#hdLocaltionStatusId").val(response.Data.Id);

                $('html,body').animate({ scrollTop: 0 });
            }
            //logisticJs.stopLoading();
        },
        error: function (status) {
            //logisticJs.stopLoading();
        }
    });
};

CmsShop.LocaltionStatus.DeleteLocaltionStatus = function (id) {
    var p = this;
    if (id == 1 || id == 2) {
        logisticJs.msgWarning({
            text:'Trạng thái này không xóa được.'
        });
        return;
    }
    logisticJs.msgConfirm({        
        text: 'Bạn có chắc muốn xóa trạng thái này?'
    }, function () {
        $.ajax({
            type: "GET",
            url: "/LocaltionStatus/Delete",
            data: { Id: id },
            dataType: "json",
            beforeSend: function () {
                //logisticJs.startLoading();
            },
            success: function (response) {
                if (response.status) {                
                    p.LoadAllLocaltionStatus(function () {
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

CmsShop.LocaltionStatus.LoadAllLocaltionStatus = function (callback) {
    var p = this;

    var dataparam = {keySearch:p.keySearch, pageIndex: p.pageIndex, pageSize: p.pageSize };

    $.ajax({
        type: "GET",
        url: "/LocaltionStatus/ListAllPaging",
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
                    render += Mustache.render(template, {
                        stt: i+1, id: item.Id, name: item.Name
                    });                    
                });
                if (render != undefined) {
                    $("#listAllLocaltionStatus").html(render);
                }                
                p.WrapPaging(response.totalCount, '#btnNext', '#btnPrevious',response.totalRow, function () {
                    p.LoadAllLocaltionStatus(function () {
                        p.RegisterEvents();
                    });
                });

            } else {
                $("#listAllLocaltionStatus").html('');
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

CmsShop.LocaltionStatus.WrapPaging = function (total, next, previous, RecordCount, callBack) {
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

CmsShop.LocaltionStatus.EmptyLocaltionStatus = function() {
        
    $("#txtName").val('');   
    $("#btnSaveLocaltionStatus").attr('data-id', 0);
    $("#hdLocaltionStatusId").val(0);
};

$(function(){
    CmsShop.LocaltionStatus.Init();
});