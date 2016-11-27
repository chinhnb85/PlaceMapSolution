(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery", "../jquery.validate"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: FR (French; français)
 */
$.extend($.validator.messages, {
	required: "Không được để trống",
	remote: "Veuillez corriger ce champ.",
	email: "Veuillez fournir une adresse électronique valide."	
});

}));