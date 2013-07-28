(function() {
    "use strict";

    var path = require( "path" );
    var spec = path.join.bind( null, __dirname, "spec" );
    var swrap = require( ".." );

    // Expose some globals
    global.expect = require( "chai" ).expect;
    swrap.expose();

    // List of files which we'll test
    var files = [
        "class",
        "config",
        "app"
    ].map(function( file ) {
        return spec( file );
    });

    if ( require.main.filename.indexOf( "mocha" ) > -1 ) {
        // Run tests when called via mocha CLI
        files.forEach(function( file ) {
            require( file );
        });
    } else {
        // Run tests when called via node CLI
        var mocha = new ( require( "mocha" ) )({
            ui: "tdd",
            reporter: "spec"
        });

        files.forEach(function( file ) {
            mocha.addFile( file );
        });

        mocha.run(function( failures ) {
            process.exit( failures );
        });
    }
})();