(function() {
    "use strict";

    /**  @namespace */
    var swrap = {};
    swrap._ = require( "lodashed" );
    swrap.util = require( "util" );

    [
        "class",
        "config",
        "app"
    ].forEach(function( lib ) {
        swrap[ lib ] = require( "./lib/" + lib )( swrap );
    });

    module.exports = swrap;
})();