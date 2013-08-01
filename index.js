module.exports = process.env.SWRAP_COV ?
    require( "./lib-cov/swrap" ) :
    require( "./lib/swrap" );