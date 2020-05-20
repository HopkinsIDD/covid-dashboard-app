const fs = require('fs');

// Builds json of county boundaries using geoJSON FeatureCollections format
// Run separately from main.js!

function buildFIPSmap() {
    // writes json Object of format {state_fip: {state_name, state_usps}} from csv
    // https://www.nrcs.usda.gov/wps/portal/nrcs/detail/?cid=nrcs143_013696
    // one time use: file lives at src/store/state_fips.json

    const FIPSmap = {};

    try {
        const path = '/Users/genevieve/Documents/WORK/JohnsHopkins/covid-dashboard-app/src/store/state_fips.csv'
        // const path = '/Users/lxu213/Documents/covid-dashboard-app/src/store/state_fips.csv';
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

function formatPopulations() {
    try {
        const path = '/Users/genevieve/Documents/WORK/JohnsHopkins/covid-dashboard-app/src/store/co-est2019-alldata.csv'
        // const path = '/Users/lxu213/Documents/covid-dashboard-app/src/store/state_fips.csv';
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);
        const popObject = {}

        lines.forEach((line,index) => {
            // if (index === 0) console.log(line)
            if (index > 0) {
                const splitLine = line.split(',');
                const geoid = splitLine[3] + splitLine[4];
                const pop = splitLine[7]
                // console.log(geoid, pop)
                popObject[geoid] = pop
            }
        })

        return popObject;

    } catch (err) {
        console.error(err);
    };
}

module.exports = {
    populateGeoObj: function populateGeoObj() {
        // writes populated targetObj of FeatureCollections by state to geoByState.json
        // one time use: file lives at src/store/geoByState.json
    
        const targetObj = initGeoObj();
        const sourceArray = require('../store/geo/countyBoundaries.json').features;
        const popObj = formatPopulations();
    
        for (let geoObj of sourceArray) {
    
            const state = geoObj.properties.STATE;
            const geoid = geoObj.properties.STATE + geoObj.properties.COUNTY;
            const population = popObj.geoid;

            geoObj.properties.geoid = geoid;
            geoObj.properties.population = population;
            
            delete geoObj.properties.GEO_ID;
            delete geoObj.properties.STATE;
            delete geoObj.properties.COUNTY;
            delete geoObj.properties.NAME;
            delete geoObj.properties.LSAD;
            delete geoObj.properties.CENSUSAREA;
            
            // const newProps = {}
            // newProps.type = 'Feature';
            // newProps.properties = {}
            // newProps.properties.geoid = geoid;
            // newProps.properties.population = popObj[geoid];
            // newProps.geometry = {}
            // newProps.geometry.type = 'Polygon';
            // newProps.geometry.coordinates = geoObj.geometry.coordinates;
    
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
// formatPopulations()
module.exports.populateGeoObj()

