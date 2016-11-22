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

    });
})(jQuery, window, document);

var logisticJs = $.extend({
    init: function () {
        //$('#list-Kit, .bootbox-body').niceScroll();
        $("html").niceScroll({ horizrailenabled: false });
        $('#Logout').off('click').on('click', function () {
            var inteval = setInterval(logisticJs.msgConfirm({
                text: "Vous pouvez quitter le système?",
                modal: true,
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
            })
        });
        $('#Profile').off('click').on('click', function () {
            var url = window.location.pathname;
            if (url.indexOf('ClientPage') > 0) {
                $('#myProfile').modal('hide');
            }
            else {
                $('#myProfile').modal('toggle');
                var id = $('#hdfProfileAccID').val();
                $.ajax({
                    type: "GET",
                    url: "/Utilisateur/viewDetail",
                    data: { id: id },
                    dataType: "json",
                    beforeSend: function () {
                        logisticJs.startLoading();
                    },
                    success: function (response) {                        
                        if (response.status == true) {
                            $('#UserNameProfile').val(response.Data.UserName);
                            $('#NameProfile').val(response.Data.Name);
                            $('#LastNameProfile').val(response.Data.LastName);
                            $('#selectTypeProfile').val(response.Data.Type);
                            $('#hdfTypeProfile').val(response.Data.Type);
                            var type = response.Data.Type;
                            var typeText = "";
                            switch (type) {
                                case 1:
                                    typeText = "Administrateur";
                                    break;
                                case 2:
                                    typeText = "Chauffeur";
                                    break;
                                case 3:
                                    typeText = "Client";
                                    break;
                                case 4:
                                    typeText = "Utilisateur";
                                    break;
                            }
                            $('#lblTypeProfile').html(typeText);
                            if (response.Data.Type == 2 || response.Data.Type == 3) {
                                logisticJs.getObjectByType(response.Data.Type, response.Data.ObjectID);
                                var objID = response.Data.ObjectID;
                                //$('#selectObjectProfile').removeClass('hide');
                                $('#hdfObjectProfile').val(objID);
                                setTimeout(function () {
                                    $('#selectObjectProfile').val(objID);
                                }, 500);

                            }
                            else {
                                $('#selectObjectProfile').addClass('hide');
                            }
                            $('#EmailProfile').val(response.Data.Email);
                            $('#PhoneProfile').val(response.Data.Phone);
                            var active = response.Data.Active;
                            if (active == 0) {
                                $('#chkActiveProfile').prop('checked', false);
                                $('#hdfActiveProfile').val('false');
                            }
                            else {
                                $('#chkActiveProfile').prop('checked', true);
                                $('#hdfActiveProfile').val('true');
                            }
                            $('#txtPwd, #txtRePwd').val('123456');
                            //$('.form-control').attr('readonly', 'readonly');
                            $('#UserNameProfile').attr('readonly', 'readonly');
                            $('#chkActiveProfile').attr('readonly', 'readonly');
                            $('#btnUpdateProfile').off('click').on('click', function () {
                                var accID = $('#hdfProfileAccID').val();
                                var name = $('#NameProfile').val();
                                var lastName = $('#LastNameProfile').val();
                                var email = $('#EmailProfile').val();
                                var phone = $('#PhoneProfile').val();
                                var emailReg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/;
                                var phoneReg = /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/;
                                if ($.trim(name).length <= 0) {
                                    logisticJs.msgError({
                                        text: "Le nom est obligatoire",
                                        modal: true,
                                        titleHeader: "Lỗi"
                                    });
                                    $('#NameProfile').focus();
                                    return false;
                                }
                                if ($.trim(lastName).length <= 0) {
                                    logisticJs.msgError({
                                        text: "Le prénom est obligatoire",
                                        modal: true,
                                        titleHeader: "Lỗi"
                                    });
                                    $('#LastNameProfile').focus();
                                    return false;
                                }
                                if ($.trim(email).length <= 0) {
                                    logisticJs.msgError({
                                        text: "Le email est obligatoire",
                                        modal: true,
                                        titleHeader: "Lỗi"
                                    });
                                    $('#EmailProfile').focus();
                                    return false;
                                }
                                if ($.trim(phone).length <= 0) {
                                    logisticJs.msgError({
                                        text: "Le phone est obligatoire",
                                        modal: true,
                                        titleHeader: "Lỗi"
                                    });
                                    $('#PhoneProfile').focus();
                                    return false;
                                }
                                if (!emailReg.test(email)) {
                                    logisticJs.msgError({
                                        text: "Non valide email",
                                        modal: true,
                                        titleHeader: "Lỗi"
                                    });
                                    $('#EmailProfile').focus();
                                    return false;
                                }
                                if (!phoneReg.test(phone)) {
                                    logisticJs.msgError({
                                        text: "Non valide phone",
                                        modal: true,
                                        titleHeader: "Lỗi"
                                    });
                                    $('#PhoneProfile').focus();
                                    return false;
                                }
                                $.ajax({
                                    type: "POST",
                                    url: "/Utilisateur/updateProfile",
                                    data: { id: accID, name: name, lastName: lastName, email: email, phone: phone },
                                    dataType: "json",
                                    beforeSend: function () {
                                        logisticJs.startLoading();
                                    },
                                    success: function (response) {
                                        //alert(response.status);
                                        logisticJs.msgAlert({
                                            text: "Mise à jour profil succès",
                                            modal: true,
                                            titleHeader: "Alerte"
                                        });
                                        $('#myProfile').modal('hide');
                                        logisticJs.stopLoading();
                                    },
                                    error: function () {
                                        logisticJs.stopLoading();
                                    }
                                })
                            })
                            logisticJs.stopLoading();
                        }
                    },
                    error: function () {
                        logisticJs.stopLoading();
                    }
                });
            }
        });                
    },   
    getObjectByType: function (typeId, objectId) {
        $.ajax({
            type: "GET",
            url: "/Utilisateur/getObject",
            data: { typeId: typeId },
            dataType: "json",
            beforeSend: function () {
                logisticJs.startLoading();
            },
            success: function (response) {
                if (response.status == true) {
                    if (response.Data != null && response.totalCount > 0) {
                        $('#divObject').removeClass('hide');
                        //$('#selectObject').css('display', 'block');
                        var template = $("#result-ObjectProfile").html();
                        var render = "<option value=''>Choisissez les données</option>";
                        var objText = "";
                        var k = 0;
                        if (typeId == 2) {
                            $.each(response.Data, function (i, item) {
                                render += Mustache.render(template, {
                                    id: item.idDriver, text: item.name + ' ' + item.lastName
                                });
                                if (item.idDriver == objectId) {
                                    objText = item.name + ' ' + item.lastName;
                                }
                                k = k + 1;

                            });
                            if (render != undefined)
                                $("#selectObjectProfile").html(render);
                        }
                        else if (typeId == 3) {
                            $.each(response.Data, function (i, item) {
                                render += Mustache.render(template, {
                                    id: item.idClient, text: item.name + ' ' + item.lastName
                                });
                                if (item.idClient == objectId) {
                                    objText = item.name + ' ' + item.lastName;
                                }
                                k = k + 1;
                            });
                            if (render != undefined)
                                $("#selectObjectProfile").html(render);
                        }
                        else {
                            if (render != undefined)
                                $("#selectObjectProfile").html(render);
                        }
                        $('#lblObjectProfile').html(objText);

                    }
                    $('#selectObjectProfile').on('change', function () {
                        $('#hdfObjectProfile').val($('#selectObjectProfile').val());
                    });
                }
                logisticJs.stopLoading();
            },
            error: function (status) {
                logisticJs.stopLoading();
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
            titleHeader: 'Confirmation'
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
    convertDatetimeDMY: function (datetime) {
        var newdate = new Date(parseInt(datetime));
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
        },

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
        },
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
    formatNumber: function ReplaceNumberWithCommas(yourNumber) {
        //Seperates the components of the number
        var components = yourNumber.toString().split(".");
        //Comma-fies the first part
        components[0] = components[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        //Combines the two sections
        return components.join(".");
    }
});
//logisticJs.init();