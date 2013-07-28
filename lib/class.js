module.exports = function( swrap ) {
    /* jshint validthis: true */
    "use strict";

    var util = swrap.util;
    var _ = swrap._;

    var classes = [];

    /**
     * @class
     * @since   0.3.0
     * @name    swrap.class
     */
    function Class() {}

    function extend( proto, statics ) {
        var parent, ctor;

        proto = _.isPlainObject( proto ) ? proto : {};
        parent = this;

        // The powerful constructor.
        // Wraps user-defined constructor to do some extra ops in the object context
        ctor = function() {
            if ( this instanceof ctor ) {
                var self = this;

                if ( !_.has( this, "super" ) ) {
                    // We give a reference to the superclass, avoiding to set it over and over...
                    Object.defineProperty( this, "super", {
                        enumerable: false,
                        writable: false,
                        configurable: false,
                        value: parent.prototype
                    });
                }

                // Bring the prototype into this instance
                /*_.extendDeep( this, _.omit( proto, "constructor" ) );*/

                // Make all _ properties not enumerable
                _.forOwn( this, function( val, key ) {
                    var descriptor;
                    if ( /^_(.*)$/i.test( key ) ) {
                        descriptor = Object.getOwnPropertyDescriptor( self, key );
                        if ( !descriptor.configurable ) {
                            // Can't do anything about not configurable props... :'(
                            return;
                        }

                        descriptor.enumerable = false;
                        Object.defineProperty( self, key, descriptor );
                    }
                });

                ( _.has( proto, "constructor" ) ? proto.constructor : parent ).apply(
                    this,
                    arguments
                );
            } else {
                // John Resig-style constructor
                var args = _.toArray( arguments );
                args.unshift( ctor );
                return new ( _.partial.apply( null, args ) )();
            }
        };

        // Inherit the parent
        util.inherits( ctor, parent );
        delete ctor.super_;

        // Give static properties
        _.extend( ctor, statics );

        // Give prototype properties
        _.extend( ctor.prototype, proto );

        // Give hability to extend and inherit
        ctor.extend = extend.bind( ctor );
        ctor.inherit = inherit.bind( ctor );

        // Keep a storage with classes created thru this method so far.
        // Used to easy checking if a function being dealt is a class or not
        classes.push( ctor );

        return ctor;
    }

    function inherit( superCtor ) {
        // Hold a backup of the current prototype
        var proto = this.prototype;

        // Update the prototype chain
        util.inherits( this, superCtor );

        // And give back the old prototype
        _.extend( this.prototype, proto );

        return this;
    }

    Class.is = function( fn ) {
        if ( !_.isFunction( fn ) ) {
            fn = Object.getPrototypeOf( fn ).constructor;
        }

        return classes.indexOf( fn ) > -1;
    };

    Class.extend = extend.bind( Class );
    Class.inherit = inherit.bind( Class );

    return Class;
};