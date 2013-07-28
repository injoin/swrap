suite( "App", function() {
    "use strict";

    var path = require( "path" );
    var App = swrap.app;

    setup(function() {
        this.app = new App( __dirname );
    });

    teardown(function() {
        delete this.app;
    });

    test( ".path()", function() {
        var testPath = this.app.path( "path", "to", "file.json" );
        expect( testPath ).to.equal( path.join( __dirname, "path", "to", "file.json" ) );
    });

    suite( ".set()", function() {
        test( "service instances", function() {
            var service = new swrap.class();
            this.app.set( "foo", service );

            expect( this.app._services ).to.deep.equal({
                foo: service
            });
        });

        test( "skip non object services", function() {
            this.app.set( "foo", "bar" );
            this.app.set( "baz", true );

            expect( this.app._services ).to.deep.equal({});
        });
    });

    suite( ".get()", function() {
        test( "returns the specified service instance", function() {
            var service = {};
            this.app.set( "foo", service );

            expect( this.app.get( "foo" ) ).to.equal( service );
        });

        test( "returns null for inexistent services", function() {
            expect( this.app.get( "foo" ) ).to.be.null;
        });
    });

    test( "contains a configuration storage", function() {
        expect( this.app.config ).to.be.an.instanceof( swrap.config );
    });
});