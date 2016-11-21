$(function () {

    $('#btnLogin').off('click').on('click', function() {
        login();
    });

    $("#btnLogin").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#btnLogin").click();
        }
    });
    
});

function login() {
    //if ($("#frmLogin").valid()) {
    var userName = $('#UserName').val();
    var password = $('#Password').val();
    var data = { userName: userName, password: password };

    $.post("/Login/Login", data, function (res) {
        if (res.status) {
            location.href = "/";
        } else {
            alert("Tài khoản không đúng!");                
        }
    }, "json");

    //}
};