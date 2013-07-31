module.exports = exports = function( app, swrap ) {
    "use strict";
    app.fooLib = app.fooLib || 0;

    return {
        context: this,
        args: arguments,
        loadCount: ++app.fooLib
    };
};