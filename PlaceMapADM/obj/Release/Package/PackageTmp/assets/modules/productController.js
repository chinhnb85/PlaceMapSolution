if (typeof (CmsShop) == "undefined") CmsShop = {};
if (typeof (CmsShop.Product) == "undefined") CmsShop.Product = {};

CmsShop.Product = {
    PageSize: 100,
    PageIndex:1
}

CmsShop.Product.Init = function () {
    var $this = CmsShop.Product;    
   
    $('#summernoteDescription').summernote({ height: 300 });
    $('#summernoteVideo').summernote({ height: 300 });

    $this.LoadAllProduct(function (data) {
        $this.LoadDropdowListProduct(data);
        //$("#sltProduct").chosen();
    });

    $this.RegisterEvents();
};

CmsShop.Product.RegisterEvents = function () {
    var $this = CmsShop.Product;

    $("#btnAddNewProduct").off("click").on("click", function () {
        $this.AddNewProduct();
    });
};

CmsShop.Product.AddNewProduct = function () {
    var $this = CmsShop.Product;

    var name = $("#txtNameProduct").val();
    var parentId = $("#sltProduct").val();

    var data = { name: name, parentId: parentId };

    $.post("/Product/Add", data, function (res) {
        if (res.status) {
            $("#txtNameProduct").val("");
            $("#sltProduct").val(0);

            $this.LoadAllProduct(function (obj) {
                $this.LoadDropdowListProduct(obj);
                //$("#sltProduct").chosen();
                //$("#sltProduct").trigger('liszt:updated');
            });
        }
    }, "json");
};

CmsShop.Product.LoadAllProduct = function (callback) {
    var $this = CmsShop.Product;

    var data = { pageIndex: $this.PageIndex, pageSize: $this.PageSize };

    $.get("/Product/ListAllPaging", data, function (res) {
        if (res.status) {            
            $("#listAllProduct").empty();
            $.each(res.Data, function (i, item) {
                if (item.ParentId === 0) {
                    var temp = '<tr>' +
                        '<td>' + item.Id + '</td>' +
                        '<td>' + item.Name + '</td>' +
                        '<td>' +
                        '<a href="#" class="btn btn-info btn-xs edit" data-id="' + item.Id + '"><i class="fa fa-edit"></i> Edit</a>' +
                        '<a href="#" class="btn btn-danger btn-xs delete" data-id="' + item.Id + '"><i class="fa fa-trash-o"></i> Delete</a>' +
                        '</td>' +
                        '</tr>';
                    $("#listAllProduct").append(temp);
                    $.each(res.Data, function (j, item1) {
                        if (item.Id === item1.ParentId) {
                            temp = '<tr>' +
                                '<td>' + item1.Id + '</td>' +
                                '<td>--- ' + item1.Name + '</td>' +
                                '<td>' +
                                '<a href="#" class="btn btn-info btn-xs edit" data-id="' + item1.Id + '"><i class="fa fa-edit"></i> Edit</a>' +
                                '<a href="#" class="btn btn-danger btn-xs delete" data-id="' + item1.Id + '"><i class="fa fa-trash-o"></i> Delete</a>' +
                                '</td>' +
                                '</tr>';
                            $("#listAllProduct").append(temp);
                            $.each(res.Data, function (k, item2) {
                                if (item1.Id === item2.ParentId) {
                                    temp = '<tr>' +
                                        '<td>' + item2.Id + '</td>' +
                                        '<td>------ ' + item2.Name + '</td>' +
                                        '<td>' +
                                        '<a href="#" class="btn btn-info btn-xs edit" data-id="' + item2.Id + '"><i class="fa fa-edit"></i> Edit</a>' +
                                        '<a href="#" class="btn btn-danger btn-xs delete" data-id="' + item2.Id + '"><i class="fa fa-trash-o"></i> Delete</a>' +
                                        '</td>' +
                                        '</tr>';
                                    $("#listAllProduct").append(temp);
                                    $.each(res.Data, function (m, item3) {
                                        if (item2.Id === item3.ParentId) {
                                            temp = '<tr>' +
                                                '<td>' + item3.Id + '</td>' +
                                                '<td>--------- ' + item3.Name + '</td>' +
                                                '<td>' +
                                                '<a href="#" class="btn btn-info btn-xs edit" data-id="' + item3.Id + '"><i class="fa fa-edit"></i> Edit</a>' +
                                                '<a href="#" class="btn btn-danger btn-xs delete" data-id="' + item3.Id + '"><i class="fa fa-trash-o"></i> Delete</a>' +
                                                '</td>' +
                                                '</tr>';
                                            $("#listAllProduct").append(temp);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
            if(typeof(callback)=="function"){
                callback(res.Data);
            }
        } 
    }, "json");
};

CmsShop.Product.LoadDropdowListProduct = function (data) {
    if (data != null) {                
        var temp = '<option value="0">Danh mục</option>';        
        $.each(data, function (i, item) {
            var name = item.Name;
            if (item.ParentId === 0) {
                temp += '<option value="' + item.Id + '">' + name + '</option>';
                $.each(data, function (j, item1) {
                    if (item.Id === item1.ParentId) {
                        name = "--- " + item1.Name;
                        temp += '<option value="' + item1.Id + '">' + name + '</option>';
                        $.each(data, function (k, item2) {
                            if (item1.Id === item2.ParentId) {
                                name = "------ " + item2.Name;
                                temp += '<option value="' + item2.Id + '">' + name + '</option>';
                                $.each(data, function (m, item3) {
                                    if (item2.Id === item3.ParentId) {
                                        name = "--------- " + item3.Name;
                                        temp += '<option value="' + item3.Id + '">' + name + '</option>';
                                    }
                                });
                            }
                        });
                    }
                });                
            }
        });

        $("#sltProduct").empty().html(temp);
        
        $("#sltProduct").chosen();
        $("#sltProduct").trigger("liszt:updated");
    }
};

$(function(){
    CmsShop.Product.Init();
});