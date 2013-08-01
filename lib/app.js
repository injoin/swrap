module.exports = function( swrap ) {
    "use strict";

    var path = require( "path" );
    var _ = swrap._;

    /**
     * @class
     * @since   0.0.1
     * @name    swrap.app
     */
    var app = swrap.class.extend;

    /**
     * @lends   swrap.app.prototype
     */
    var proto = {};

    /**
     * The app root
     *
     * @private
     * @since   0.0.1
     * @type    {String}
     */
    proto._root = "";

    /**
     * @private
     * @since   0.0.1
     * @type    {object}
     */
    proto._services = null;

    /**
     * @private
     * @since   0.0.3
     * @type    {object}
     */
    proto._libs = null;

    /**
     * Creates a new application from a directory.
     *
     * If the given directory is not absolute, it'll be made relative to the process
     * current working directory.
     *
     * @since   0.0.1
     * @param   {String} root
     */
    proto.constructor = function( root ) {
        this.super.constructor.call( this, {
            wildcard: true,
            delimiter: ".",
            newListener: false,
            maxListeners: 0
        });

        root = path.normalize( String( root ) );
        if ( !/^\/|[a-z]:(\/|\\)/i.test( root ) ) {
            root = path.join( process.cwd(), root );
        }

        this._root = root;
        this._services = {};
        this._libs = {};
        this.config = swrap.config();
    };

    /**
     * Set a new service in the app
     *
     * @since   0.0.1
     * @param   {String} name
     * @param   {Function} definition
     * @returns {swrap.app}
     */
    proto.set = function( name, definition ) {
        var app = this;

        if ( typeof definition === "function" ) {
            definition(function( service ) {
                app._services[ name ] = service;

                // Emit the service.* events
                app.emit( "service." + name, service, app );
            }, app, swrap );
        }

        return this;
    };

    /**
     * Get a service from the app
     *
     * @since   0.0.1
     * @param   {String} name
     * @returns {*}
     */
    proto.get = function( name ) {
        return this._services[ name ] || null;
    };

    /**
     * Remove a service from the app
     *
     * @since   0.0.2
     * @param   {String} name
     * @returns {swrap.app}
     */
    proto.remove = function( name ) {
        delete this._services[ name ];
        this.emit( "remove." + name, this );
        return this;
    };

    /**
     * Require a file relative to the app root in the context of a service,
     * if it does export a function.
     *
     * @since   0.0.2
     * @param   {String} path
     * @param   {String} service
     * @returns {*}
     */
    proto.require = function( path, service ) {
        var serviceObj = this.get( service );
        var module = require( this.path( path ) );

        if ( typeof module === "function" ) {
            module = module( serviceObj, this, swrap );
        }

        return module;
    };

    /**
     * Lazily load a library within an app root lib/ directory.
     *
     * @since   0.0.3
     * @param   {String} name   The name of the desired lib.
     * @returns {*}
     */
    proto.lib = function( name ) {
        var lib;
        name = name == null ? "" : String( name );

        // Don't allow to retrieve the index file of the lib/ dir if it's empty
        if ( !name ) {
            return null;
        }

        lib = this._libs[ name ];

        // Try to load the lib only if this hasn't been done before
        if ( lib === undefined ) {
            try {
                lib = require( this.path( "lib", name ) ).call( this, this, swrap );
            } catch ( e ) {
                lib = null;
            }

            this._libs[ name ] = lib;
        }

        return lib;
    };

    /**
     * Append paths to the app root directory.
     *
     * @since   0.0.1
     * @returns {String}
     */
    proto.path = function() {
        var root = this._root;
        var args = _.toArray( arguments );
        args.unshift( root );

        return path.join.apply( null, args );
    };

    app = app( proto );
    app.inherit( require( "eventemitter2" ).EventEmitter2 );

    return app;
};