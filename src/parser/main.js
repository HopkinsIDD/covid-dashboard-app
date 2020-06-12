// ASSUMPTIONS 
// one scenario per directory with 3 severity levels, one sim per file
// severity is first word in filename "high_death-0000.csv"
// sim numbers are evenly distributed - reduction is based on divisibility

// TO TEST
// populate geoid, slice scenarios, slice files, check reduceSims

const fs = require('fs');
const validate = require('./validate');
const parse = require('./parse');
const utils = require('./utils');
const quantile = require('./quantiles');
const transform = require('./transform');
const geostat = require('./geostat');
const constants = require('./constants')

function buildDataset(dir, geoids) {

    const parameters = constants.parameters;
    const severities = constants.severities;
    const scenarios = fs.readdirSync(dir)
        .filter(file => file !== '.DS_Store');
        // .slice(0,1); 

    // faster to grab dates from the get-go
    const dates = utils.getDates(dir, scenarios);

    // validate input files
    validate.validateFiles(dir);

    // parse all files in scenario directories
    const parsedObj = parse.parseDirectories(
        dir,
        geoids,
        scenarios,
        dates
        );

    // add state-level sims, init obj that just contains states to pass in
    const states = [...new Set(geoids.map(geoid => geoid.slice(0, 2)))];
    const finalObj = utils.initObj(states, scenarios, severities, parameters, dates);
    utils.aggregateByState(
        parsedObj, 
        finalObj,
        states,
        geoids,
        scenarios, 
        severities,
        parameters,
        dates
        );

    // transform each simObj to D3-friendly format
    transform.toD3format(
        dir,
        parsedObj,
        scenarios,
        severities,
        parameters
        );
    
    // quantiles should be based on all sims
    quantile.addQuantiles(
        parsedObj, 
        scenarios,
        severities,
        parameters,
        dates);

    // reduce number of sims to ~20 
    // utils.reduceSims(dir, parsedObj);

    // build stats for GeoMap Boundaries before quantiles are transformed
    geostat.buildGeoMapData(parsedObj);

    // transform quantiles
    quantile.transformQuantiles(parsedObj, dates)

    // write to individual files (only a subset, for now)
    const geoidsToSave = [
        '06', '06037', '06075', '06085', '06019', 
        '36', '36005', '36061', '36081'
    ];
    utils.writeToFile(parsedObj, geoidsToSave);

    // add a county to 06085 to simulate 6 scenarios
    // utils.combineCaliCounties();
    
    console.log('end:', new Date());
    console.log('data processing complete!'); 
}

const dir = 'src/store/sims/';
const geoids = [].concat(constants.geoidsCA, constants.geoidsNY);

// TODO: geoids should default to all unless specified for testing
buildDataset(dir, geoids)
