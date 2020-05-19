const fs = require('fs');

// Builds json of county boundaries using geoJSON FeatureCollections format
// Run separately from main.js!

function buildFIPSmap() {
    // writes json Object of format {state_fip: {state_name, state_usps}} from csv
    // https://www.nrcs.usda.gov/wps/portal/nrcs/detail/?cid=nrcs143_013696
    // one time use: file lives at src/store/state_fips.json

    const FIPSmap = {};

    try {
        const path = '/Users/lxu213/Documents/covid-dashboard-app/src/store/state_fips.csv';
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);

        lines.forEach(line => {
            if (line !== "stname, st, stusps") {
                const splitLine = line.split(', ');
                const fips = splitLine[1];
                const name = splitLine[0];
                const usps = splitLine[2];
    
                FIPSmap[fips] = {
                    'usps': usps,
                    'name': name,
                }
            }
        })

        const json = JSON.stringify(FIPSmap);

        fs.writeFile('src/store/state_fips.json', json, 'utf8', function(err) {
            if (err) throw err;
        });

    } catch (err) {
        console.error(err);
    };
}

function initGeoObj() {
    // initialize Object of FeatureCollections by state
    // one time use to support populateGeoObj

    const geoObj = {};
    const states = Object.keys(require('../store/geo/state_fips.json'));

    for (let state of states) {
        geoObj[state] = {
            type: "FeatureCollection",
            features: []
        }
    }

    return geoObj;
}

module.exports = {
    populateGeoObj: function populateGeoObj() {
        // writes populated targetObj of FeatureCollections by state to geoByState.json
        // one time use: file lives at src/store/geoByState.json
    
        const targetObj = initGeoObj();
        const sourceArray = require('../store/geo/countyBoundaries.json').features;
    
        for (let geoObj of sourceArray) {
    
            const state = geoObj.properties.STATE;
    
            if (state in targetObj){
                targetObj[state].features.push(geoObj);
    
            } else {
                console.log('state', state)
            }
        }
    
        const json = JSON.stringify(targetObj);
    
        fs.writeFile('src/store/geoMapByState.json', json, 'utf8', function(err) {
            if (err) throw err;
        });
    }
}

// buildFIPSmap()
module.exports.populateGeoObj()

// counties for demo (CA, AL, MA, NY)
const geoids = ['06001', '06003', '06005', '06007', '06009', '06011', '06013', 
    '06015', '06017', '06019', '06021', '06023', '06025', '06027', '06029', '06031', 
    '06033', '06035', '06037', '06039', '06041', '06043', '06045', '06047', '06049', 
    '06051', '06053', '06055', '06057', '06059', '06061', '06063', '06065', '06067', 
    '06069', '06071', '06073', '06075', '06077', '06079', '06081', '06083', '06085', 
    '06087', '06089', '06091', '06093', '06095', '06097', '06099', '06101', '06103', 
    '06105', '06107', '06109', '06111', '06113', '06115',
    '01001', '01003', '01005', '01007', '01009', '01011', '01013', '01015', '01017',
    '01019', '01021', '01023', '01025', '01027', '01029', '01031', '01033', '01035', 
    '01037', '01039', '01041', '01043', '01045', '01047', '01049', '01051', '01053', 
    '01055', '01057', '01059', '01061', '01063', '01065', '01067', '01069', '01071', 
    '01073', '01075', '01077', '01079', '01081', '01083', '01085', '01087', '01089', 
    '01091', '01093', '01095', '01097', '01099', '01101', '01103', '01105', '01107', 
    '01109', '01111', '01113', '01115', '01117', '01119', '01121', '01123', '01125', 
    '01127', '01129', '01131', '01133',
    '25001', '25003', '25005', '25007', '25009', '25011', '25013', '25015', '25017', 
    '25019', '25021', '25023', '25025', '25027',
    '36001', '36003', '36005', '36007', '36009', '36011', '36013', '36015', '36017', 
    '36019', '36021', '36023', '36025', '36027', '36029', '36031', '36033', '36035', 
    '36037', '36039', '36041', '36043', '36045', '36047', '36049', '36051', '36053', 
    '36055', '36057', '36059', '36061', '36063', '36065', '36067', '36069', '36071', 
    '36073', '36075', '36077', '36079', '36081', '36083', '36085', '36087', '36089', 
    '36091', '36093', '36095', '36097', '36099', '36101', '36103', '36105', '36107', 
    '36109', '36111', '36113', '36115', '36117', '36119', '36121', '36123']
