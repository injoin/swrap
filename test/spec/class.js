suite( "Class", function() {
    "use strict";

    var http = require( "http" );
    var Class = swrap.class;

    setup(function() {
        this.proto = {
            a: true,
            b: function() {},
            _f: "foo"
        };
        this.statics = {
            c: 123,
            d: "yay",
            e: function() {}
        };

        this.clazz = Class.extend( this.proto, this.statics );
    });

    suite( ".extend()", function() {
        test( "gives prototype from the 1st arg", function() {
            expect( this.clazz.prototype ).to.deep.equal( this.proto );
        });

        test( "gives static properties from the 2nd arg", function() {
            expect( this.clazz ).to.contain.keys( Object.keys( this.statics ) );
        });

        test( "allows J. Resig style constructors", function() {
            var instance = this.clazz();
            expect( instance ).to.be.instanceof( this.clazz );
        });
    });

    suite( ".inherit()", function() {
        setup(function() {
            this.clazz.inherit( http.Server );
        });

        test( "change the parent class", function() {
            var instance = new this.clazz();
            expect( instance ).to.be.an.instanceof( http.Server );
        });

        test( "keeps original prototype", function() {
            expect( this.clazz.prototype ).to.contain.keys( Object.keys( this.proto ) );
        });
    });

    suite( ".is()", function() {
        test( "check if class was created via .extend()", function() {
            expect( Class.is( this.clazz ) ).to.be.ok;
        });

        test( "check if a object is from a class created via .extend()", function() {
            var instance = new this.clazz();
            expect( Class.is( instance ) ).to.be.ok;
        });
    });
});