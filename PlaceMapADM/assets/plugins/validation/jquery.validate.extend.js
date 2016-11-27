//HuyTQ
//Add regex check for JQuery Validation Plugin
$.validator.addMethod(
        "regex",
        function (value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Caractère non valide"
);
$.validator.addMethod(
        "regexi",
        function (value, element, regexp) {
            var re = new RegExp(regexp, 'i');
            return this.optional(element) || re.test(value);
        },
        "Caractère non valide"
);
$.validator.addMethod(
        "frenchNumber",
        function (value, element) {
            return this.optional(element) || /(^(\d{1,3}\s)*\d{1,3}(,\d{1,2})*$)|(^\d+(,\d{1,2})*$)/.test(value);
        },
        $.validator.messages.frenchNumber
);

$.validator.addMethod("alphanumeric", function (value, element) {
    return this.optional(element) || /^\w+$/i.test(value);
}, $.validator.messages.alphaNum);

$.validator.addMethod("userRule", function (value, element) {
    return this.optional(element) || /^[a-zA-Z]+\w+$/i.test(value);
}, $.validator.messages.userRule);

$.validator.addMethod("frenchDate", function (value, element) {
    return value.match(/^\d\d?\/\d\d?\/\d\d\d\d$/);
}, "Se il vous plaît entrer une date dans le format.");
//compare date
$.validator.addMethod("greaterThan",
function (value, element, params) {
    if (!/Invalid|NaN/.test(new Date(formatDate(value)))) {
        return new Date(formatDate(value)) >= new Date(formatDate($(params).val()));
    } else {
        return false;
    }
}, 'Date de fin doit commencer après la date.');

function formatDate(strDate) {
    var newDate = strDate.split('/');
    var d = newDate[0];
    var m = newDate[1];
    var y = newDate[2];
    return y + "-" + m + "-" + d;
}
