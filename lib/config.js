module.exports = function( swrap ) {
    "use strict";

    var cjson = require( "cjson" );
    var dotty = require( "dotty" );
    var _ = swrap._;

    /**
     * Configuration storage with support for nested keys.
     *
     * @class
     * @since   0.0.1
     * @name    swrap.config
     */
    var config = swrap.class.extend;

    /**
     * @lends   swrap.config.prototype
     */
    var proto = {};

    /**
     * @private
     * @since   0.0.1
     * @type    {Object}
     */
    proto._storage = null;

    /**
     * @since   0.0.1
     */
    proto.constructor = function() {
        this.clear();
    };

    /**
     * Clear this configuration storage.
     *
     * @since   0.0.1
     * @returns {swrap.config}
     */
    proto.clear = function() {
        this._storage = {};
        return this;
    };

    /**
     * Get a value from the current configuration.
     *
     * @since   0.0.1
     * @param   {String} key
     * @returns {*}
     */
    proto.get = function( key ) {
        return dotty.get( this._storage, key );
    };

    /**
     * Set a value in this instance
     *
     * @since   0.0.1
     * @param   {String} key
     * @param   {*} val
     * @returns {swrap.config}
     */
    proto.set = function( key, val ) {
        dotty.put( this._storage, key, val );
        this.emit( "change", key, val, this );

        return this;
    };

    /**
     * Remove a key from this instance
     *
     * @since   0.0.1
     * @param   {String} key
     * @returns {swrap.config}
     */
    proto.remove = function( key ) {
        dotty.remove( this._storage, key );
        return this;
    };

    /**
     * Does this storage has the specified key?
     *
     * @since   0.0.1
     * @param   {String|String[]} key
     * @returns {*}
     */
    proto.has = function( key ) {
        return dotty.exists( this._storage, key );
    };

    /**
     * Extend this instance with a JSON file contents.
     * If <code>key</code> is passed, the file contents will extend that key from the storage
     * root. This key cannot be dotted/nested.
     *
     * @since   0.0.1
     * @param   {String} [key]
     * @param   {String} file
     * @returns {swrap.config}
     */
    proto.load = function( key, file ) {
        var obj, root;
        if ( typeof file !== "string" ) {
            file = key;
            key = null;
        }

        obj = cjson.load( file );
        if ( typeof key === "string" ) {
            this._storage[ key ] = this._storage[ key ] || {};
            root = this._storage[ key ];
        } else {
            root = this._storage;
        }

        _.merge( root, obj );
        return this;
    };

    /**
     * Get the size of this storage.
     *
     * @since   0.0.2
     * @returns {Number}
     */
    proto.size = function() {
        return _.size( this._storage );
    };

    config = config( proto ).inherit( require( "events" ).EventEmitter );
    return config;
};