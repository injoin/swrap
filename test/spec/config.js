suite( "Config", function() {
    "use strict";

    var config = swrap.config;

    setup(function() {
        this.cfg = config();
    });

    test( ".clear()", function() {
        this.cfg.set( "key", true );
        this.cfg.set( "my.awesome.key", "foobar" );
        this.cfg.clear();

        expect( this.cfg._storage ).to.deep.equal({});
    });

    test( ".set()", function() {
        this.cfg.set( "key", true );
        expect( this.cfg._storage.key ).to.equal( true );

        this.cfg.set( "nested.key.works.too", 123 );
        expect( this.cfg._storage.nested.key.works.too ).to.equal( 123 );
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
});