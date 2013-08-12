(function( $ ){ /*http://docs.jquery.com/Plugins/Authoring*/
    var methods = {
        myMet: function(color1, color2) { /*body */}
    };

    $.fn.myFunc = function( method ) { if ( methods[method] ) { return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 )); } else if ( typeof method === 'object' || ! method ) { return methods.init.apply( this, arguments ); } else { $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' ); } };

})( jQuery );   /* $('.main').myFunc('myMet', '#aaa', '#bbb'); */


$(function() {

    $.getScript('any_additional.js'); //http://api.jquery.com/jQuery.getScript/

});