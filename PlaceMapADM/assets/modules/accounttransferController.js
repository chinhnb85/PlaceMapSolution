if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.AccountTransfer) == "undefined") CmsShop.AccountTransfer = {};

CmsShop.AccountTransfer = {    
    pageSizeA: 20,
    pageIndexA: 1,
    keySearchA: '',
    type: 2,
    pageSizeB: 20,
    pageIndexB: 1,
    keySearchB: '',
    userIdA: 0,
    userIdB: 0,
    parentId: 0,
    provinceId: 0,
    listSelectChecked: []
};

CmsShop.AccountTransfer.Init = function () {
    var p = this;    

    logisticJs.activeMenuSidebar('/');

    p.LoadAllAccountByType(function () {
        $("#sltAccountA").select2();
        $("#sltAccountB").select2();
        p.LoadAllLocaltionByUserA(function() {
            p.RegisterEvents();
        });
        p.LoadAllLocaltionByUserB();
    });

    p.RegisterEvents();
};

CmsShop.AccountTransfer.LoadAllAccountByType = function (callback) {

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
                    $("#sltAccountA").append(render);
                    $("#sltAccountB").append(render);
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

CmsShop.AccountTransfer.RegisterEvents = function() {
    var p = this;

    $("#sltAccountA").off("change").on("change", function () {
        $('#cbxSelectedAllA').prop('checked', false);
        p.listSelectChecked = [];
        p.userIdA = $("#sltAccountA").val();
        p.LoadAllLocaltionByUserA(function () {
            p.RegisterEvents();
        });
    });

    $("#sltAccountB").off("change").on("change", function () {
        p.userIdB = $("#sltAccountB").val();
        p.LoadAllLocaltionByUserB();
    });

    $('#cbxSelectedAllA').off('click').on('click', function () {        
        if ($(this).is(":checked")) {            
            $.each($(".cbxSelectedA"), function (i, item) {
                if (!$(item).is(":checked")) {
                    $(item).prop('checked', true);
                    p.listSelectChecked.push($(item).attr('data-id'));
                }
            });
        } else {
            $.each($(".cbxSelectedA"), function (i, item) {
                if ($(item).is(":checked")) {
                    $(item).prop('checked', false);
                    p.listSelectChecked.splice($.inArray($(this).attr('data-id'), p.listSelectChecked), 1);
                }
            });
        }
    });

    $('.cbxSelectedA').off('click').on('click', function () {
        if ($(this).is(":checked")) {
            $(this).prop('checked', true);
            p.listSelectChecked.push($(this).attr('data-id'));
        } else {
            $(this).prop('checked', false);
            p.listSelectChecked.splice($.inArray($(this).attr('data-id'), p.listSelectChecked), 1);
        }
    });

    $('#btnUpdateLocaltionByUser').off('click').on('click', function () {
        if (p.userIdA != 0 && p.userIdB != 0 && p.userIdA != p.userIdB && p.listSelectChecked.length>0) {

            var dataparam = {isAll:false, userIdA: p.userIdA, userIdB: p.userIdB, listLocaltionId:p.listSelectChecked };

            logisticJs.msgConfirm({
                text: 'Bạn có chắc muốn điều chuyển?'
            }, function () {
                $.ajax({
                    type: "POST",
                    url: "/Localtion/UpdateLocaltionByAccountId",
                    data: dataparam,
                    dataType: "json",
                    beforeSend: function () {
                        logisticJs.startLoading();
                    },
                    success: function (response) {
                        if (response.status) {
                            p.LoadAllLocaltionByUserA(function() {
                                p.RegisterEvents();
                            });
                            p.LoadAllLocaltionByUserB();
                            logisticJs.msgShowSuccess({ titleHeader: 'Điều chuyển thành công.' });
                        } else {
                            logisticJs.msgWarning({
                                text: "Việc điều chuyển tài khoản gặp lỗi.",
                                modal: true
                            });
                        }
                        logisticJs.stopLoading();
                    },
                    error: function (status) {
                        logisticJs.stopLoading();
                    }
                });
            });
        } else if (p.listSelectChecked.length == 0) {
            logisticJs.msgWarning({
                text: "Chọn địa điểm cần điều chuyển."
            });        
        } else if (p.userIdA == 0) {
            logisticJs.msgWarning({
                text: "Chọn tài khoản điều chuyển bên A."
            });
        } else if (p.userIdB == 0) {
            logisticJs.msgWarning({
                text: "Chọn tài khoản điều chuyển bên B."
            });
        } else if (p.userIdA == p.userIdB) {
            logisticJs.msgWarning({
                text: "Tài khoản điều chuyển bên A giống bên B."
            });
        }
    });

    $('#btnUpdateLocaltionByAll').off('click').on('click', function () {
        if (p.userIdA != 0 && p.userIdB != 0 && p.userIdA != p.userIdB) {
            var dataparam = { isAll: true, userIdA: p.userIdA, userIdB: p.userIdB, listLocaltionId: p.listSelectChecked };

            logisticJs.msgConfirm({
                text: 'Bạn có chắc muốn điều chuyển?'
            }, function () {
                $.ajax({
                    type: "POST",
                    url: "/Localtion/UpdateLocaltionByAccountId",
                    data: dataparam,
                    dataType: "json",
                    beforeSend: function () {
                        logisticJs.startLoading();
                    },
                    success: function (response) {
                        if (response.status) {
                            p.LoadAllLocaltionByUserA(function () {
                                p.RegisterEvents();
                            });
                            p.LoadAllLocaltionByUserB();
                            logisticJs.msgShowSuccess({ titleHeader: 'Điều chuyển thành công.' });
                        } else {
                            logisticJs.msgWarning({
                                text: "Việc điều chuyển tài khoản gặp lỗi.",
                                modal: true
                            });
                        }
                        logisticJs.stopLoading();
                    },
                    error: function (status) {
                        logisticJs.stopLoading();
                    }
                });
            });

        } else if (p.userIdA == 0) {
            logisticJs.msgWarning({
                text: "Chọn tài khoản điều chuyển bên A."
            });
        } else if (p.userIdB == 0) {
            logisticJs.msgWarning({
                text: "Chọn tài khoản điều chuyển bên B."
            });
        } else if (p.userIdA == p.userIdB) {
            logisticJs.msgWarning({
                text: "Tài khoản điều chuyển bên A giống bên B."
            });
        }
    });
};

CmsShop.AccountTransfer.LoadAllLocaltionByUserA = function (callback) {
    var p = this;

    var dataparam = { accountId: p.userIdA, parentId: p.parentId, provinceId: p.provinceId, keySearch: p.keySearchA, pageIndex: p.pageIndexA, pageSize: p.pageSizeA };

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
                var template = $("#package-data-localtion-a").html();
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
                p.WrapPagingA(response.totalCount, '#btnNextLocaltionA', '#btnPreviousLocaltionA', response.totalRow, function () {
                    $("#cbxSelectedAllA").prop('checked', false);
                    p.LoadAllLocaltionByUserA(function() {
                        if (p.listSelectChecked.length > 0) {
                            var k = 0;
                            var y = 0;
                            $.each($(".cbxSelectedA"), function (i, item) {
                                for (var j = 0; j < p.listSelectChecked.length; j++) {
                                    if ($(item).attr('data-id') == p.listSelectChecked[j]) {
                                        $(".cbxSelectedA[data-id=" + p.listSelectChecked[j] + "]").prop('checked', true);
                                        k++;
                                    }                                    
                                }
                                y++;
                            });
                            if (k == y) {
                                $("#cbxSelectedAllA").prop('checked', true);
                            }
                        }

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
                p.WrapPagingA(0, '#btnNextLocaltionA', '#btnPreviousLocaltionA', 0);
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

CmsShop.AccountTransfer.WrapPagingA = function (total, next, previous, recordCount, callBack) {
    var p = this;

    var totalsize = Math.ceil(recordCount / p.pageSizeA);
    var pg = "";
    if (totalsize > 1)
        $('#pagerLocaltionA').removeClass('hide');
    else
        $('#pagerLocaltionA').addClass('hide');
    pg = logisticJs.paginate(p.pageIndexA, recordCount, p.pageSizeA);
    $('#pagerLocaltionA').find('.pg').remove();
    $('.btnPreviousLocaltionA').after(pg);
    $('#pagerLocaltionA').find('.pg_' + p.pageIndexA).addClass('active');
    if (total >= p.pageSizeA) {
        $('.btnNextLocaltionA').removeClass('disabled');
    } else {
        $('.btnNextLocaltionA').addClass('disabled');
    }
    if (p.pageIndexA > 1) {
        $('.btnPreviousLocaltionA').removeClass('disabled');
    } else {
        $('.btnPreviousLocaltionA').addClass('disabled');
    }
    $(next).off('click').on('click', function () {
        if ($('.btnNextLocaltionA').hasClass('disabled')) return false;
        p.pageIndexA++;
        setTimeout(callBack(), 200);
        return false;
    });
    $(previous).off('click').on('click', function () {
        if ($('.btnPreviousLocaltionA').hasClass('disabled')) return false;
        p.pageIndexA--;
        setTimeout(callBack(), 200);
        return false;
    });

    $('#pagerLocaltionA').find('.pg').off('click').on('click', function () {
        var curentPage = $(this).attr("data-page");
        p.pageIndexA = curentPage;
        $('#pagerLocaltionA').find('.pg').removeClass('active');
        $(this).addClass('active');
        callBack();
    });
};

CmsShop.AccountTransfer.LoadAllLocaltionByUserB = function (callback) {
    var p = this;

    var dataparam = { accountId: p.userIdB, parentId: p.parentId, provinceId: p.provinceId, keySearch: p.keySearchB, pageIndex: p.pageIndexB, pageSize: p.pageSizeB };

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
                var template = $("#package-data-localtion-b").html();
                var render = "";
                $.each(response.Data, function (i, item) {
                    var avatar = "/assets/img/avatars/no-avatar.gif";
                    if (item.Avatar != "" && item.Avatar != null) {
                        avatar = item.Avatar;
                    }
                    render += Mustache.render(template, {
                        stt: i + 1, id: item.Id, name: item.Name, avatar: avatar
                    });
                });
                if (render != undefined) {
                    $("#listAllLocaltionB").html(render);
                }
                p.WrapPagingB(response.totalCount, '#btnNextLocaltionB', '#btnPreviousLocaltionB', response.totalRow, function () {
                    p.LoadAllLocaltionByUserB();
                });

                $(".viewdetail").off("click").on("click", function () {
                    var $this = $(this);
                    p.ViewDetailLocaltionNow($this.attr('data-id'), function () {
                        $('#myModalLocaltionDetail').modal('show');
                    });
                });

            } else {
                $("#listAllLocaltionB").html('');
                p.WrapPagingB(0, '#btnNextLocaltionB', '#btnPreviousLocaltionB', 0);
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

CmsShop.AccountTransfer.WrapPagingB = function (total, next, previous, recordCount, callBack) {
    var p = this;

    var totalsize = Math.ceil(recordCount / p.pageSizeB);
    var pg = "";
    if (totalsize > 1)
        $('#pagerLocaltionB').removeClass('hide');
    else
        $('#pagerLocaltionB').addClass('hide');
    pg = logisticJs.paginate(p.pageIndexB, recordCount, p.pageSizeB);
    $('#pagerLocaltionB').find('.pg').remove();
    $('.btnPreviousLocaltionB').after(pg);
    $('#pagerLocaltionB').find('.pg_' + p.pageIndexB).addClass('active');
    if (total >= p.pageSizeB) {
        $('.btnNextLocaltionB').removeClass('disabled');
    } else {
        $('.btnNextLocaltionB').addClass('disabled');
    }
    if (p.pageIndexB > 1) {
        $('.btnPreviousLocaltionB').removeClass('disabled');
    } else {
        $('.btnPreviousLocaltionB').addClass('disabled');
    }
    $(next).off('click').on('click', function () {
        if ($('.btnNextLocaltionB').hasClass('disabled')) return false;
        p.pageIndexB++;
        setTimeout(callBack(), 200);
        return false;
    });
    $(previous).off('click').on('click', function () {
        if ($('.btnPreviousLocaltionB').hasClass('disabled')) return false;
        p.pageIndexB--;
        setTimeout(callBack(), 200);
        return false;
    });

    $('#pagerLocaltionB').find('.pg').off('click').on('click', function () {
        var curentPage = $(this).attr("data-page");
        p.pageIndexB = curentPage;
        $('#pagerLocaltionB').find('.pg').removeClass('active');
        $(this).addClass('active');
        callBack();
    });
};

CmsShop.AccountTransfer.ViewDetailLocaltionNow = function (id, callback) {
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
    CmsShop.AccountTransfer.Init();
});