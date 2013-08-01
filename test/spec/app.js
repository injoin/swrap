suite( "App", function() {
    "use strict";

    var EventEmitter2 = require( "eventemitter2" ).EventEmitter2;
    var path = require( "path" );
    var App = swrap.app;

    suiteSetup(function() {
        this.service = {};

        this.stub = sinon.stub();
        this.stub.callsArgWith( 0, this.service );
    });

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
            this.app.set( "foo", this.stub );

            expect( this.app._services ).to.deep.equal({
                foo: this.service
            });
        });

        test( "skip non object services", function() {
            this.app.set( "foo", "bar" );
            this.app.set( "baz", true );

            expect( this.app._services ).to.deep.equal({});
        });

        test( "skip " )

        test( "trigger 'service.foo' event", function() {
            var spy = sinon.spy();
            this.app.on( "service.foo", spy );
            this.app.set( "foo", this.stub );

            expect( spy.calledOnce ).to.be.ok;
            expect( spy.args[ 0 ] ).to.deep.equal([
                this.service,
                this.app
            ]);
        });
    });

    suite( ".get()", function() {
        test( "returns the specified service instance", function() {
            this.app.set( "foo", this.stub );
            expect( this.app.get( "foo" ) ).to.equal( this.service );
        });

        test( "returns null for inexistent services", function() {
            expect( this.app.get( "foo" ) ).to.be.null;
        });
    });

    suite( ".remove()", function() {
        test( "detach service", function() {
            this.app.set( "foo", this.stub );
            this.app.remove( "foo" );

            expect( this.app._services ).to.deep.equal({});
        });

        test( "trigger 'remove.foo' event", function() {
            var spy = sinon.spy();
            this.app.on( "remove.foo", spy );

            this.app.set( "foo", this.stub );
            this.app.remove( "foo" );

            expect( spy.calledOnce ).to.be.ok;
            expect( spy.args[ 0 ] ).to.deep.equal([ this.app ]);
        });
    });

    suite( ".require()", function() {
        test( "returns the return of the module function", function() {
            var fixture;

            this.app.set( "foo", this.stub );
            fixture = this.app.require( "service-context", "foo" );

            expect( fixture ).to.deep.equal([
                this.service,
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

    test( "it's an EventEmitter2", function() {
        expect( this.app ).to.be.an.instanceof( EventEmitter2 );
    });

    test( "constructs app root from process relative path", function() {
        var app = swrap.app( "." );
        expect( app.path() ).to.equal( process.cwd() );
    });

    test( "contains a configuration storage", function() {
        expect( this.app.config ).to.be.an.instanceof( swrap.config );
    });
});