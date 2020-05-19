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
// const geostat = require('./geostat');

function buildDataset(dir, geoids) {

    const scenarios = fs.readdirSync(dir)
        .filter(file => file !== '.DS_Store');
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

    quantile.addQuantiles(parsedObj, dates);

    // build GeoMap data before quantiles are transformed
    // geostat.buildGeoMapData(parsedObj);

    // transform quantiles
    quantile.transformQuantiles(parsedObj, dates)

    utils.writeToFile(parsedObj, geoids);
    
    console.log('end:', new Date());
    console.log('parse complete!'); 
}

const dir = 'src/store/sims/';
const geoids = ['06085', '06019', '36061', '25017', '01081'];

// todo: geoids should default to all unless specified for testing
buildDataset(dir, geoids)

