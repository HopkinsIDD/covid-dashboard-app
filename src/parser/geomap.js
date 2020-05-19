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

