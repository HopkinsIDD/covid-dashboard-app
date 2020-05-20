// ASSUMPTIONS 
// one scenario per directory with 3 severity levels 
// one simulation per file
// severity is first word in filename "high_death-0000.csv"
// sim numbers are evenly distributed - reduction is based on divisibility

// TO TEST
// shorten scenarios and files to run, remove reduceSims function

const fs = require('fs');
const parse = require('./parse');
const utils = require('./utils');
const quantile = require('./quantiles');
// const constants = require('./constants');
// const geostat = require('./geostat');

function buildDataset(dir, geoids) {

    const scenarios = fs.readdirSync(dir)
        .filter(file => file !== '.DS_Store')
        //.slice(0,1); 

    // faster to grab dates from the get-go
    const dates = utils.getDates(dir, scenarios);

    // TODO: readParquet.js
    const parsedObj = parse.parseDirectories(
        dir,
        geoids,
        scenarios,
        dates
        );

    // quantiles should be based on all sims
    quantile.addQuantiles(parsedObj, dates);

    // TODO: reduce the number of sims to 20

    // build GeoMap data before quantiles are transformed
    // geostat.buildGeoMapData(parsedObj);

    // transform quantiles
    quantile.transformQuantiles(parsedObj, dates)

    utils.writeToFile(parsedObj, geoids);

    // some post-processing to get 6 scenarios
    utils.combineCaliCounties();
    
    console.log('end:', new Date());
    console.log('parse complete!'); 
}

const dir = 'src/store/sims/';
const geoids = ['06085', '06019', '36061', '25017', '01081'];

// TODO: geoids should default to all unless specified for testing
// TODO: don't reduce sims at all
buildDataset(dir, geoids)
