suite( "Config", function() {
    "use strict";

    var config = swrap.config;

    setup(function() {
        this.cfg = config();
    });

    test( "is EventEmitter", function() {
        expect( this.cfg ).to.be.an.instanceof( require( "events" ).EventEmitter );
    });

    test( ".clear()", function() {
        this.cfg.set( "key", true );
        this.cfg.set( "my.awesome.key", "foobar" );
        this.cfg.clear();

        expect( this.cfg._storage ).to.deep.equal({});
    });

    suite( ".set()", function() {
        test( "sets new value", function() {
            this.cfg.set( "key", true );
            expect( this.cfg._storage.key ).to.equal( true );

            this.cfg.set( "nested.key.works.too", 123 );
            expect( this.cfg._storage.nested.key.works.too ).to.equal( 123 );
        });

        test( "emits 'change' event", function() {
            var spy = sinon.spy();
            this.cfg.on( "change", spy );
            this.cfg.set( "foo", "bar" );

            expect( spy.args[ 0 ][ 0 ] ).to.equal( "foo" );
            expect( spy.args[ 0 ][ 1 ] ).to.equal( "bar" );
            expect( spy.args[ 0 ][ 2 ] ).to.equal( this.cfg );
        });
    });

    test( ".get()", function() {
        var val;
        this.cfg.set( "nested.key", "foo" );

        val = this.cfg.get( "nested.key" );
        expect( val ).to.equal( "foo" );

        val = this.cfg.get( "nested" );
        expect( val ).to.have.property( "key", "foo" );
    });

    test( ".remove()", function() {
        this.cfg.set( "nested.key", "foo" );

        this.cfg.remove( "nested.key" );
        expect( this.cfg.get( "nested" ) ).to.deep.equal({});

        this.cfg.remove( "nested" );
        expect( this.cfg.get( "nested" ) ).to.be.undefined;
    });

    test( ".has()", function() {
        this.cfg.set( "my.key", "foo" );
        expect( this.cfg.has( "my.key" ) ).to.be.ok;
    });

    suite( ".load()", function() {
        test( "extend root object", function() {
            this.cfg.load( "test/fixtures/config.json" );
            expect( this.cfg.has( "my.key" ) ).to.be.ok;
        });

        test( "extend an specific key", function() {
            this.cfg.load( "baz", "test/fixtures/config.json" );
            expect( this.cfg.has( "baz.foobar" ) ).to.be.ok;
        });
    });

    test( ".size()", function() {
        this.cfg.set( "foo.bar", "baz" );
        this.cfg.set( "triple.foo", 123 );
        this.cfg.set( "double.bar", function() {});

        expect( this.cfg.size() ).to.equal( 3 );
    });
});