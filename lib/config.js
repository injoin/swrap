module.exports = function( swrap ) {
    "use strict";

    var cjson = require( "cjson" );
    var dotty = require( "dotty" );

    /**
     * @class
     * @since   0.0.1
     * @name    swrap.config
     */
    var config = swrap.class;

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
        this._storage = {};
    };

    /**
     * Get a value from the current configuration
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
      @returns {swrap.config}
     */
    this.set = function( key, val ) {
        dotty.put( this._storage, key, val );
        return this;
    };

    /**
     * Remove a key from this instance
     *
     * @since   0.0.1
     * @param   {String} key
     * @returns {swrap.config}
     */
    this.remove = function( key ) {
        dotty.remove( this._storage, key );
        return this;
    };

    /**
     * Search for a specified key in this instance
     *
     * @since   0.0.1
     * @param   {String|String[]} key
     * @returns {*}
     */
    proto.search = function( key ) {
        return dotty.search( this._storage, key );
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

        _.extendDeep( root, obj );
        return this;
    };

    return config( proto, statics );
};