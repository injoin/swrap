suite( "App", function() {
    "use strict";

    var path = require( "path" );
    var App = swrap.app;

    setup(function() {
        this.app = new App( path.resolve( __dirname, "../fixtures" ) );
    });

    teardown(function() {
        delete this.app;
    });

    test( ".path()", function() {
        var testPath = this.app.path( "path", "to", "file.json" );
        expect( testPath ).to.equal(path.join(
            __dirname,
            "../fixtures",
            "path", "to", "file.json"
        ));
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

    test( ".remove()", function() {
        this.app.set( "foo", {} );
        this.app.remove( "foo" );

        expect( this.app._services ).to.deep.equal({});
    });

    suite( ".require()", function() {
        test( "returns the return of the module function", function() {
            var fixture;
            var service = {};

            this.app.set( "foo", service );
            fixture = this.app.require( "service-context", "foo" );

            expect( fixture ).to.deep.equal([
                service,
                this.app,
                swrap
            ]);
        });

        test( "returns the module if not a function", function() {
            var fixture = this.app.require( "service-context2", "foo" );
            expect( fixture ).to.equal( "foobar" );
        });
    });

    suite( ".lib()", function() {
        test( "returns null if empty name", function() {
            expect( this.app.lib() ).to.be.null;
        });

        test( "returns null for inexistent libs", function() {
            expect( this.app.lib( "barbaz" ) ).to.be.null;
        });

        test( "lib args are app and swrap", function() {
            var lib = this.app.lib( "foo" );
            expect( lib.args ).to.deep.equal([
                this.app,
                swrap
            ]);
        });

        test( "lib context is app", function() {
            var lib = this.app.lib( "foo" );
            expect( lib.context ).to.equal( this.app );
        });

        test( "load lib only once", function() {
            var lib;
            this.app.lib( "foo" );
            lib = this.app.lib( "foo" );

            expect( lib.loadCount ).to.equal( 1 );
        });
    });

    test( "constructs app root from process relative path", function() {
        var app = swrap.app( "." );
        expect( app.path() ).to.equal( process.cwd() );
    });

    test( "contains a configuration storage", function() {
        expect( this.app.config ).to.be.an.instanceof( swrap.config );
    });
});