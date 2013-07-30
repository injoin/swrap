process.env.SWRAP_COV = process.argv.indexOf( "--SWRAP_COV" ) > -1;
module.exports = process.env.SWRAP_COV === "true" ?
    require( "./lib-cov/swrap" ) :
    require( "./lib/swrap" );