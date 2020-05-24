// ASSUMPTIONS 
// one scenario per directory with 3 severity levels, one sim per file
// severity is first word in filename "high_death-0000.csv"
// sim numbers are evenly distributed - reduction is based on divisibility

// TO TEST
// populate geoid, slice scenarios, slice files

const fs = require('fs');
const parse = require('./parse');
const utils = require('./utils');
const quantile = require('./quantiles');
const transform = require('./transform');
const geostat = require('./geostat');

function buildDataset(dir, geoids) {

    const scenarios = fs.readdirSync(dir)
        .filter(file => file !== '.DS_Store');
        // .slice(0,1); 

    // faster to grab dates from the get-go
    const dates = utils.getDates(dir, scenarios);
    
    // add state geoids to geoid list
    const states = [...new Set(geoids.map(geoid => geoid.slice(0, 2)))];
    geoids = geoids.concat(states);
    
    const parsedObj = parse.parseDirectories(
        dir,
        geoids,
        scenarios,
        dates
        );

    // transform each simObj to D3-friendly format
    transform.toD3format(parsedObj, geoids, scenarios);
    
    // quantiles should be based on all sims
    quantile.addQuantiles(parsedObj, dates);

    // reduce number of sims to ~20 
    utils.reduceSims(dir, parsedObj);

    // build stats for GeoMap Boundaries before quantiles are transformed
    geostat.buildGeoMapData(parsedObj);

    // transform quantiles
    quantile.transformQuantiles(parsedObj, dates)

    // write to individual files
    utils.writeToFile(parsedObj, geoids);
    
    console.log('end:', new Date());
    console.log('data processing complete!'); 
}

const dir = 'src/store/sims/';

// all CA and NY counties 
const geoids = [
    '06001', '06003', '06005', '06007', '06009', '06011', '06013', '06015', '06017', 
    '06019', '06021', '06023', '06025', '06027', '06029', '06031', '06033', '06035', 
    '06037', '06039', '06041', '06043', '06045', '06047', '06049', '06051', '06053', 
    '06055', '06057', '06059', '06061', '06063', '06065', '06067', '06069', '06071', 
    '06073', '06075', '06077', '06079', '06081', '06083', '06085', '06087', '06089', 
    '06091', '06093', '06095', '06097', '06099', '06101', '06103', '06105', '06107', 
    '06109', '06111', '06113', 
    '36001', '36003', '36005', '36007', '36009', '36011', '36013', '36015', '36017', 
    '36019', '36021', '36023', '36025', '36027', '36029', '36031', '36033', '36035', 
    '36037', '36039', '36041', '36043', '36045', '36047', '36049', '36051', '36053', 
    '36055', '36057', '36059', '36061', '36063', '36065', '36067', '36069', '36071', 
    '36073', '36075', '36077', '36079', '36081', '36083', '36085', '36087', '36089', 
    '36091', '36093', '36095', '36097', '36099', '36101', '36103', '36105', '36107', 
    '36109', '36111', '36113', '36115', '36117', '36119', '36121', '36123']

// const geoids = ['06085', '06095'];
// TODO: geoids should default to all unless specified for testing
buildDataset(dir, geoids)
