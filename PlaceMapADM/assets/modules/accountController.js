if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.Account) == "undefined") CmsShop.Account = {};

CmsShop.Account = {
    PageSize: 10,
    PageIndex:1
}

CmsShop.Account.Init = function () {
    var p = this;    

    p.LoadAllAccount(function () {

    });

    p.RegisterEvents();
};

CmsShop.Account.RegisterEvents = function () {
    var p = this;

    $("#btnAddNewAccount").off("click").on("click", function () {
        p.AddNewAccount();
    });
};

CmsShop.Account.AddNewAccount = function () {
    var p = this;

    var name = $("#txtNameAccount").val();
    var parentId = $("#sltAccount").val();

    var data = { name: name, parentId: parentId };

    $.post("/Account/Add", data, function (res) {
        if (res.status) {
            $("#txtNameAccount").val("");
            $("#sltAccount").val(0);

            p.LoadAllAccount(function () {
               
            });
        }
    }, "json");
};

CmsShop.Account.LoadAllAccount = function (callback) {
    var p = this;

    var data = { pageIndex: p.PageIndex, pageSize: p.PageSize };

    $.get("/Account/ListAllPaging", data, function (res) {
        if (res.status) {            
            $("#listAllAccount").empty();
            $.each(res.Data, function (i, item) {                
                var temp = '<tr>' +
                    '<td>' + item.Id + '</td>' +
                    '<td>' + item.DisplayName + '</td>' +
                    '<td>' + item.UserName + '</td>' +
                    '<td>' + item.Email + '</td>' +
                    '<td>' + item.DeviceMobile + '</td>' +
                    '<td>' + item.CreatedDate + '</td>' +
                    '<td style="text-align: center;">' +
                    '<a href="#" class="btn btn-info btn-xs edit" data-id="' + item.Id + '"><i class="fa fa-edit"></i> Edit</a> ' +
                    '<a href="#" class="btn btn-danger btn-xs delete" data-id="' + item.Id + '"><i class="fa fa-trash-o"></i> Delete</a>' +
                    '</td>' +
                    '</tr>';

                $("#listAllAccount").append(temp);                                    
            });
            if(typeof(callback)=="function"){
                callback();
            }
        } 
    }, "json");
};

$(function(){
    CmsShop.Account.Init();
});