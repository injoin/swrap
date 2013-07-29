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
     * Creates a new application from a directory.
     *
     * If the given directory is not absolute, it'll be made relative to the process
     * current working directory.
     *
     * @since   0.0.1
     * @param   {String} root
     */
    proto.constructor = function( root ) {
        root = path.normalize( String( root ) );
        if ( !/^\/|[a-z]:(\/|\\)/i.test( root ) ) {
            root = path.join( process.cwd(), root );
        }

        this._root = root;
        this._services = {};
        this.config = swrap.config();
    };

    /**
     * Set a new service in the app
     *
     * @since   0.0.1
     * @param   {String} name
     * @param   {Object} object
     * @returns {swrap.app}
     */
    proto.set = function( name, object ) {
        if ( _.isObject( object ) ) {
            this._services[ name ] = object;
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

    return app( proto );
};