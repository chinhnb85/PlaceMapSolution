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