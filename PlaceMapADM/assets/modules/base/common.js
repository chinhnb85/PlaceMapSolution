$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined;
};

(function ($, window, document, undefined) {
    function getInternetExplorerVersion()
        // Returns the version of Internet Explorer or a -1
        // (indicating the use of another browser).
    {
        var rv = -1; // Default value assumes failure.
        var ua = navigator.userAgent;

        // If user agent string contains "MSIE x.y", assume
        // Internet Explorer and use "x.y" to determine the
        // version.

        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
        return rv;

    }

    $(document).ready(function () {
        var version = getInternetExplorerVersion();
        if (version != -1 && version < 8) {
            alert("Your browser version is not supported. For better view, please upgrade IE version 8 above.");
        }
        $("body").removeClass("hide");

        logisticJs.init();
    });
})(jQuery, window, document);

var logisticJs = $.extend({
    _URL: window.URL || window.webkitURL,
    sessionUser: {
        userId:0,
        userName: '',
        email:'',
        displayName: ''        
    },
    init: function () {
        logisticJs.getObject();

        $('#btnThoat,#btn_logout').off('click').on('click', function () {
            var inteval = setInterval(logisticJs.msgConfirm({                
                text: "Bạn muốn thoát đăng nhập?"
            }, function () {
                $.ajax({
                    type: "GET",
                    url: "/Login/Logout",
                    data: {},
                    beforeSend: function () {
                        logisticJs.startLoading();
                    },
                    success: function () {
                        window.location.href = '/Login';
                        logisticJs.stopLoading();
                    },
                    error: function () {
                        logisticJs.stopLoading();
                    }
                });
            }), 500, function () {
                clearInterval(inteval);
            });
        });
        $('#btnProfile').off('click').on('click', function () {
            
        });
        $('#btnSetting').off('click').on('click', function () {

        });
        $('#btn_UploadImage').off('click').on('click', function () {
            $("#f_UploadImage").trigger('click');
            $("#f_UploadImage").off('change').on('change', function () {
                var file;
                if ((file = this.files[0])) {
                    logisticJs.sendFile(file, 'Avatar', function (url) {
                        var $itemuser = $('.login-area.dropdown-toggle');
                        var $itemdropdown = $('.pull-right.dropdown-menu.dropdown-arrow.dropdown-login-area');
                        var avatar = "/assets/img/avatars/no-avatar.gif";
                        if (url != null && url != "") {
                            avatar = url;
                        }
                        $('.avatar img', $itemuser).attr('src', avatar);
                        $('.avatar-area img', $itemdropdown).attr('src', avatar);
                        logisticJs.updateAccountAvatar(logisticJs.sessionUser.userId, avatar);
                    });
                }
            });
        });                
    },
    sendFile:function (file,folder,calback) {            
        var formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        $.ajax({
            type: 'post',
            url: 'Handler/HandlerUpload.ashx',
            data: formData,
            beforeSend: function () {
                //logisticJs.startLoading();                
            },
            success: function (url) {
                if (url != 'error') {
                    if(typeof(calback)=='function'){
                        calback(url);
                    }                    
                }
                //logisticJs.stopLoading();
            },
            processData: false,
            contentType: false,
            error: function () {
                //logisticJs.stopLoading();
                logisticJs.msgError({text:'Việc upload xảy ra lỗi. Thử lại!'});
            }
        });
    },    
    getObject: function () {
        $.ajax({
            type: "GET",
            url: "/Account/getObject",            
            dataType: "json",
            beforeSend: function () {
                logisticJs.startLoading();
            },
            success: function (response) {
                if (response.status == true && response.Data!=null) {
                    var $itemuser=$('.login-area.dropdown-toggle');
                    var $itemdropdown = $('.pull-right.dropdown-menu.dropdown-arrow.dropdown-login-area');
                    var avatar = "/assets/img/avatars/no-avatar.gif";
                    if (response.Data.Avatar!=null) {
                        avatar = response.Data.Avatar;
                    }
                    $('.avatar img', $itemuser).attr('src', avatar);
                    $('.profile span', $itemuser).html(response.Data.DisplayName);
                    $('.email a', $itemdropdown).html(response.Data.Email);
                    $('.username a', $itemdropdown).html(response.Data.UserName);
                    $('.avatar-area img', $itemdropdown).attr('src', avatar);
                    logisticJs.sessionUser.userId = response.Data.Id;
                    logisticJs.sessionUser.userName = response.Data.UserName;
                    logisticJs.sessionUser.email = response.Data.Email;
                    logisticJs.sessionUser.displayName = response.Data.DisplayName;
                }
                logisticJs.stopLoading();
            },
            error: function (status) {
                logisticJs.stopLoading();
            }
        });
    },
    updateAccountAvatar: function (id,avatar) {
        $.ajax({
            type: "GET",
            url: "/Account/updateAccountAvatar",
            data:{Id:id, Avatar:avatar},
            dataType: "json",
            beforeSend: function () {
                logisticJs.startLoading();
            },
            success: function (response) {
                if (response.status == true) {
                    logisticJs.msgShowSuccess({ text: 'Update ảnh thành công.' });
                }
                logisticJs.stopLoading();
            },
            error: function (status) {
                logisticJs.stopLoading();
            }
        });
    },
    activeMenuSidebar: function (currentAction) {
        $('.nav.sidebar-menu > li').each(function (i) {
            $(this).removeClass('active');
            var action = $('a', $(this)).attr('href');
            if (action == currentAction) {
                $(this).addClass('active');
            }            
        });
    },
    //--------------Message alert--------------------
    alert: function (options) {
        var titleHeader = "";
        if (typeof options.titleHeader != undefined) {
            titleHeader = options.titleHeader;
        }
        var defaultOptions = {
            layout: 'center',
            theme: 'defaultTheme',
            type: 'alert',
            text: '',
            dismissQueue: true,
            template: '<div class="noty_message"><div class="noty-header">' + titleHeader + '</div><div class="noty_text"></div><div class="noty_close"></div></div>',
            animation: {
                open: { height: 'toggle' },
                close: { height: 'toggle' },
                easing: 'swing',
                speed: 500
            },
            timeout: 1000, //1s
            force: false,
            modal: true,
            maxVisible: 1, // max item display
            closeWith: ['button'], /// ['click', 'button', 'hover']
            callback: {
                onShow: function () {
                },
                afterShow: function () {
                    var that = this;
                    $.each(that.options.buttons, function (i, v) {
                        if (v.focus != undefined && v.focus == true) {
                            $(that.$buttons).find("button")[i].focus();
                            return false;
                        }
                    });
                },
                onClose: function () {
                },
                afterClose: function () {
                },
                onCloseClick: function () {
                }
            },
            buttons: false
        };
        /* merge options into defaultOptions, recursively */
        $.extend(true, defaultOptions, options);


        if (defaultOptions.type == 'success') {
            defaultOptions.callback.onClose.call();
            this.log(defaultOptions.text);
        } else {
            if (defaultOptions.type == 'showsuccess') {
                defaultOptions.type = 'success';
            }

            return noty(defaultOptions);
        }
        //return noty(defaultOptions);
    },
    msgAlert: function (options, callback) {
        var settings = $.extend({}, { type: 'alert' }, options);
        this.alert(settings);
    },
    msgSuccess: function (options) {
        var settings = $.extend({}, { type: 'success' }, options);
        this.alert(settings);
    },
    msgError: function (options) {
        var settings = {
            type: 'error',
            buttons: [{
                //addClass: 'btn btn-primary',
                addClass: 'btn btn-grey btn-crm btn-ok',
                text: 'OK',
                onClick: function ($noty) {
                    // this = button element
                    // $noty = $noty element
                    $noty.close();
                },
                focus: false
            }],
            modal: true,
            titleHeader: 'Lỗi'
        };
        $.extend(true, settings, options);
        this.alert(settings);
    },
    msgWarning: function (options) {
        var settings = {
            type: 'warning',
            buttons: [{
                //addClass: 'btn btn-primary',
                addClass: 'btn btn-grey btn-crm btn-ok',
                text: 'OK',
                onClick: function ($noty) {
                    // this = button element
                    // $noty = $noty element
                    $noty.close();
                },
                focus: false
            }],
            modal: true,
            titleHeader: 'Warning'
        };
        $.extend(true, settings, options);
        this.alert(settings);
    },
    msgInfor: function (options) {
        var settings = $.extend({}, { type: 'information' }, options);
        this.alert(settings);
    },
    msgShowSuccess: function (options) {
        var settings = {
            type: 'showsuccess',
            buttons: [{
                addClass: 'btn btn-grey btn-crm btn-ok',
                text: 'OK',
                onClick: function ($noty) {
                    $noty.close();
                },
                focus: false
            }],
            modal: true,
            titleHeader: 'Success'
        };
        $.extend(true, settings, options);
        this.alert(settings);
    },
    msgConfirm: function (options, callback) {
        var settings = {
            type: 'confirm',
            buttons: [{
                //addClass: 'btn btn-primary',
                addClass: 'btn btn-grey btn-crm btn-ok',
                text: 'Yes',
                onClick: function ($noty) {
                    // this = button element
                    // $noty = $noty element
                    if (callback != undefined)
                        callback();
                    $noty.close();
                },
                focus: false

            }, {
                //addClass: 'btn btn-danger',
                addClass: 'btn btn-grey btn-crm btn-cancel',
                text: 'No',
                onClick: function ($noty) {
                    $noty.close();
                },
                focus: true
            }],
            modal: true,
            titleHeader: 'Xác nhận'
        };
        $.extend(true, settings, options);
        this.alert(settings);
    },
    msgWarningWithAbort: function (options) {
        var settings = {
            type: 'confirm',
            buttons: [{
                addClass: 'btn btn-grey btn-crm btn-cancel',
                text: 'Abort',
                onClick: function ($noty) {
                    $noty.close();
                }
            }],
            modal: true
        };
        $.extend(true, settings, options);
        this.alert(settings);
    },
    //--------------End Message alert--------------------
    //--------------Format Json--------------------
    dateFormatJson: function (datetime) {
        var newdate = new Date(parseInt(datetime.substr(6)));
        var month = newdate.getMonth() + 1;
        var day = newdate.getDate();
        var year = newdate.getFullYear();
        var hh = newdate.getHours();
        var mm = newdate.getMinutes();
        if (month < 10)
            month = "0" + month;
        if (day < 10)
            day = "0" + day;
        if (hh < 10)
            hh = "0" + hh;
        if (mm < 10)
            mm = "0" + mm;
        return day + "/" + month + "/" + year + " " + hh + ":" + mm;
    },
    dateFormatJson2: function (datetime) {
        var newdate = new Date(parseInt(datetime.substr(6)));
        var month = newdate.getMonth() + 1;
        var day = newdate.getDate();
        var year = newdate.getFullYear();
        var hh = newdate.getHours();
        var mm = newdate.getMinutes();
        if (month < 10)
            month = "0" + month;
        if (day < 10)
            day = "0" + day;
        if (hh < 10)
            hh = "0" + hh;
        if (mm < 10)
            mm = "0" + mm;
        return hh + ":" + mm + " " + day + "/" + month + "/" + year;
    },
    convertDatetimeDMY: function (datetime) {
        var newdate = new Date(parseInt(datetime.substr(6)));
        var month = newdate.getMonth() + 1;
        var day = newdate.getDate();
        var year = newdate.getFullYear();        
        if (month < 10)
            month = "0" + month;
        if (day < 10)
            day = "0" + day;        
        return day + "/" + month + "/" + year;
    },
    formatDateDMY: function (newdate) {
        var month = newdate.getMonth() + 1;
        var day = newdate.getDate();
        var year = newdate.getFullYear();
        if (month < 10)
            month = "0" + month;
        if (day < 10)
            day = "0" + day;
        return day + "/" + month + "/" + year;
    },
    dateNow: function () {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        if (month < 10)
            month = "0" + month;
        if (day < 10)
            day = "0" + day;
        return day + "/" + month + "/" + year;
    },
    currentDateMDY: function () {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        if (month < 10)
            month = "0" + month;
        if (day < 10)
            day = "0" + day;
        return  month  + "/" + day + "/" + year;
    },
    startDateNow: function () {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var firstDay = new Date(year, month, 1);
        var day = firstDay.getDate();
        if (month < 10)
            month = "0" + month;
        if (day < 10)
            day = "0" + day;
        return day + "/" + month + "/" + year;
    },
    endDateNow: function () {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var lastDay = new Date(year, month, 0);
        var day = lastDay.getDate();
        if (month < 10)
            month = "0" + month;
        if (day < 10)
            day = "0" + day;
        return day + "/" + month + "/" + year;
    },
    pad: function (num) {
        num = "0" + num;
        return num.slice(-2);
    },
    timeNow: function () {
        var d = new Date();
        var hh = d.getHours();
        var mm = d.getMinutes();
        if (hh < 10)
            hh = "0" + hh;
        if (mm < 10)
            mm = "0" + mm;
        return hh + ":" + mm;
    },
    smalldateFormatJson: function (datetime) {
        var newdate = new Date(parseInt(datetime.substr(6)));
        var month = newdate.getMonth() + 1;
        var day = newdate.getDate();
        var year = newdate.getFullYear();
        if (month < 10)
            month = "0" + month;
        if (day < 10)
            day = "0" + day;
        return day + "/" + month + "/" + year;
    },
    smalldateFormatJson2: function (datetime) {
        var newdate = new Date(parseInt(datetime.substr(6)));
        var month = newdate.getMonth() + 1;
        var day = newdate.getDate();
        var year = newdate.getFullYear();
        if (month < 10)
            month = "0" + month;
        if (day < 10)
            day = "0" + day;
        return month + "/" + day + "/" + year;
    },
    //---- ajaxPost---------------
    ajaxPost: function (options) {
        var defaultOptions = {
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            //async: false,
            cache: false,
            success: function (result) {
            }
        };
        $.extend(true, defaultOptions, options);
        $.ajax(defaultOptions);
    },
    //------------- loading -----------
    startLoading: function () {
        $('.dv-loading')
               .removeClass('hide');
    },
    stopLoading: function () {
        setTimeout($('.dv-loading')
               .addClass('hide'), 100);
    },
    miniLoading: function () {
        var loading = '<img src="/Assets/img/mini-loading.gif">';
        return loading;
    },
    mediumLoading: function () {
        var loading = '<img src="/Assets/img/loading.gif">';
        return loading;
    },
    //--------------------------
    InitiateWidgets: function () {
        $('.widget-buttons *[data-toggle="maximize"]').on("click", function (event) {
            event.preventDefault();
            var widget = $(this).parents(".widget").eq(0);
            var button = $(this).find("i").eq(0);
            var compress = "fa-compress";
            var expand = "fa-expand";
            if (widget.hasClass("maximized")) {
                if (button) {
                    button.addClass(expand).removeClass(compress);
                }
                widget.removeClass("maximized");
                widget.find(".widget-body").css("height", "auto");
            } else {
                if (button) {
                    button.addClass(compress).removeClass(expand);
                }
                widget.addClass("maximized");
                maximize(widget);
            }
        });

        $('.widget-buttons *[data-toggle="collapse"]').on("click", function (event) {
            event.preventDefault();
            var widget = $(this).parents(".widget").eq(0);
            var body = widget.find(".widget-body");
            var button = $(this).find("i");
            var down = "fa-plus";
            var up = "fa-minus";
            var slidedowninterval = 300;
            var slideupinterval = 200;
            if (widget.hasClass("collapsed")) {
                if (button) {
                    button.addClass(up).removeClass(down);
                }
                widget.removeClass("collapsed");
                body.slideUp(0, function () {
                    body.slideDown(slidedowninterval);
                });
            } else {
                if (button) {
                    button.addClass(down)
                        .removeClass(up);
                }
                body.slideUp(slideupinterval, function () {
                    widget.addClass("collapsed");
                });
            }
        });

        $('.widget-buttons *[data-toggle="dispose"]').on("click", function (event) {
            event.preventDefault();
            var toolbarLink = $(this);
            var widget = toolbarLink.parents(".widget").eq(0);
            var disposeinterval = 300;
            widget.hide(disposeinterval, function () {
                widget.remove();
            });
        });
    },
    //------------Check file Upload ------------
    checkFileUpload: {
        checkimg: function (file) {
            var flag = false;
            if (file != undefined) {
                var extension = file.substr((file.lastIndexOf('.') + 1));
                // alert(extension);
                switch (extension.toLowerCase()) {
                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                    case 'gif':
                        flag = true;
                        break;
                    default:
                        flag = false;
                }
            }
            return flag;
        },
        checkFile: function (file) {
            var flag = false;
            if (file != undefined) {
                var extension = file.substr((file.lastIndexOf('.') + 1));
                switch (extension.toLowerCase()) {
                    case 'xls':
                    case 'xlsx':
                        //case 'csv':
                        flag = true;
                        break;
                    default:
                        flag = false;
                }
            }
            return flag;
        }
    },
    //----valid----
    valid: {
        isEmailAddress: function (str) {
            var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return pattern.test(str);  // returns a boolean
        },
        isNotEmpty: function (str) {
            var pattern = /\S+/;
            return pattern.test(str);  // returns a boolean
        },
        isNumber: function (str) {
            var pattern = /^\d+$/;
            return pattern.test(str);  // returns a boolean
        },
        validDecima: function (str) {
            var pattern = /^[-+]?[0-9]+(\.[0-9]+)?$/;
            return pattern.test(str);
        },
        validCurrency: function (str) {
            var pattern = /^\$?[1-9][0-9]{0,2}(,[0-9]{3})*(\.[0-9]{2})?$/;
            return pattern.test(str);
        }
    },
    paginate: function (page, total_items, limit) {
        // How many adjacent pages should be shown on each side?
        var adjacents = 1;
        /* Setup page vars for display. */
        if (page == 0) { page = 1 };                    //if no page var is given, default to 1.
        lastpage = Math.ceil(total_items / limit);		//lastpage is = total pages / items per page, rounded up.
        lpm1 = lastpage - 1;						//last page minus 1

        var pagination = "";
        if (lastpage > 1) {
            //not enough pages to bother breaking it up
            if (lastpage < 7 + (adjacents * 2)) {
                for (counter = 1; counter <= lastpage; counter++) {
                    if (counter == page) {
                        pagination += "<li class='active pg pg_" + counter + "'><a href='javascript:void(0)'>" + counter + "</a></li>";
                    } else {
                        pagination += "<li class='pg pg_" + counter + "' data-page=" + counter + "><a href='javascript:void(0)'>" + counter + "</a></li>";
                    }
                }
                //enough pages to hide some
            } else if (lastpage > 2 + (adjacents * 2)) {

                //close to beginning; only hide later pages
                if (page < 1 + (adjacents * 2)) {
                    for (counter = 1; counter < 4 + (adjacents * 2) ; counter++) {
                        if (counter == page) {
                            pagination += "<li class='active pg pg_" + counter + "'><a href='javascript:void(0)'>" + counter + "</a></li>";
                        } else {
                            pagination += "<li class='pg pg_" + counter + "' data-page=" + counter + "><a href='javascript:void(0)'>" + counter + "</a></li>";
                        }
                    }
                    pagination += "<li class='pg'><a>...</a></li>";
                    pagination += "<li class='pg pg_" + lpm1 + "' data-page=" + lpm1 + "><a href='javascript:void(0)'>" + lpm1 + "</a>";
                    pagination += "<li class='pg pg_" + lastpage + "' data-page=" + lastpage + "><a href='javascript:void(0)'>" + lastpage + "</a>";
                } else if (lastpage - (adjacents * 2) > page && page > (adjacents * 2)) {
                    //in middle; hide some front and some back
                    pagination += "<li class='pg pg_1' data-page='1'><a href='javascript:void(0)'>1</a></li>";
                    pagination += "<li class='pg pg_2' data-page='2'><a href='javascript:void(0)'>2</a></li>";
                    pagination += "<li class='pg'><a>...</a></li>";
                    for (counter = page - adjacents; counter <= parseInt(page) + parseInt(adjacents) ; counter++) {
                        if (counter == page){
                            pagination += "<li class='active pg pg_" + counter + "'><a href='javascript:void(0)'>" + counter + "</a></li>";
                            //$('.pg_' + counter).addClass('active');
                        }
                        else
                            pagination += "<li  class='pg pg_" + counter + "' data-page=" + counter + "><a href='javascript:void(0)'>" + counter + "</a></li>";
                    }
                    pagination += "<li class='pg'><a>...</a></li>";
                    pagination += "<li  class='pg pg_" + lpm1 + "' data-page=" + lpm1 + "><a href='javascript:void(0)'>" + lpm1 + "</a></li>";
                    pagination += "<li  class='pg pg_" + lastpage + "' data-page=" + lastpage + "><a href='javascript:void(0)'>" + lastpage + "</a></li>";
                } else {
                    //close to end; only hide early pages
                    pagination += "<li class='pg pg_1' data-page='1'><a href='javascript:void(0);'>1</a></li>";
                    pagination += "<li class='pg pg_2' data-page='2'><a href='javascript:void(0);'>2</a></li>";
                    pagination += "<li class='pg'><a>...</a></li>";
                    for (counter = lastpage - (2 + (adjacents * 2)) ; counter <= lastpage; counter++) {
                        
                        if (counter == page) {
                            pagination += "<li class='active pg pg_" + counter + "'><a href='javascript:void(0)'>" + counter + "</a></li>";
                            //$('.pg_' + counter).addClass('active');
                        } else {
                            pagination += "<li class='pg pg_" + counter + "' data-page=" + counter + "><a href='javascript:void(0)'>" + counter + "</a></li>";
                        }
                    }
                }
            }
        }
        return pagination;
    },
    formatNumber: function(yourNumber) {
        //Seperates the components of the number
        var components = yourNumber.toString().split(".");
        //Comma-fies the first part
        components[0] = components[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        //Combines the two sections
        return components.join(".");
    }
});
