if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.Login) == "undefined") CmsShop.Login = {};

$(function () {
    CmsShop.Login.Init();        
});

CmsShop.Login.Init = function () {
    var p = this;

    $('#btnLogin').off('click').on('click', function () {
        p.checklogin();
    });

    $(document).keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            p.checklogin();            
        }
    });

    $('#btnEncryptMd5').off('click').on('click', function () {
        p.md5();
    });
    $('#btnDecryptMd5').off('click').on('click', function () {
        p.md5();
    });
};

CmsShop.Login.checklogin = function () {

    var userName = $('#UserName').val();
    var password = $('#Password').val();
    if (userName.trim().length == 0 || password.trim().length == 0) {
        logisticJs.msgError({
            text: "Tài khoản hoặc mật khẩu không đúng.",
            modal: true
        });
    } else {
        var dataparam = { userName: userName, password: password };        
        $.ajax({
            type: "POST",
            url: "/Login/Login",
            data: dataparam,
            beforeSend: function () {
                logisticJs.startLoading();
            },
            success: function (response) {
                if (response.status) {
                    window.location.href = "/Home";
                } else {
                    logisticJs.stopLoading();
                    logisticJs.msgError({
                        text: "Tài khoản không đúng!",
                        modal: true
                    });
                }
            },
            error: function () {
                logisticJs.stopLoading();
            }
        });
    }
};

CmsShop.Login.md5 = function () {

    var key = $('#txtKeyMd5').val();
    if (key.trim().length == 0 || key.trim().length == 0) {
        logisticJs.msgError({
            text: "Chưa có key.",
            modal: true
        });
    } else {
        var dataparam = { key: key};
        $.ajax({
            type: "GET",
            url: "/api/userApi/GetEncryptMd5",
            data: dataparam,
            beforeSend: function () {
                logisticJs.startLoading();
            },
            success: function (response) {
                if (response.status) {
                    $('#viewMd5').html(response.Data);
                } else {
                    logisticJs.stopLoading();
                    logisticJs.msgError({
                        text: "Không lấy được Md5!",
                        modal: true
                    });
                }
                logisticJs.stopLoading();
            },
            error: function () {
                logisticJs.stopLoading();
            }
        });
    }
};