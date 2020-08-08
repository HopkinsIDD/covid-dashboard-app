const fs = require('fs');

// This script creates a json file of county boundaries 
// Uses geoJSON FeatureCollections format
// Should only be a one time use! Unless countyBoundaries.json needs updating

const STATE_FIPS_PATH = '/Users/genevieve/Documents/WORK/JohnsHopkins/covid-dashboard-app/src/store/state_fips.csv';
const FORMAT_DATA_PATH = '/Users/genevieve/Documents/WORK/JohnsHopkins/covid-dashboard-app/src/store/co-est2019-alldata.csv'
// const STATE_FIPS_PATH = '/Users/lxu213/Documents/covid-dashboard-app/src/store/state_fips.csv';


function buildFIPSmap() {
    // writes json Object of format {state_fip: {state_name, state_usps}} 
    // data from https://www.nrcs.usda.gov/wps/portal/nrcs/detail/?cid=nrcs143_013696
    // downloaded to state_fips.csv locally to build state_fips.json
    // one time use: file lives at src/store/state_fips.json

    const FIPSmap = {};
    try {
        const data = fs.readFileSync(STATE_FIPS_PATH, 'UTF-8');
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
    // one time use to support building countyBoundaries.json

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
    // use population estimates for each county to normalize all stat values 
    // to per 10k people. returns a dict of geoid and population
    try {
        // big data map file for all the populations in each county
        const data = fs.readFileSync(FORMAT_DATA_PATH, 'UTF-8');
        const lines = data.split(/\r?\n/);
        const popObject = {}

        lines.forEach((line,index) => {
            if (index > 0) {
                const splitLine = line.split(',');
                const geoid = splitLine[3] + splitLine[4];
                const pop = splitLine[7]
                popObject[geoid] = pop
            }
        })

        return popObject;

    } catch (err) {
        console.error(err);
    };
}

function populateGeoObj() {
    // writes populated targetObj of FeatureCollections by state to countyBoundaries.json
    // one time use: file lives at src/store/countyBoundaries.json

    const targetObj = initGeoObj();
    const sourceArray = require('../store/geo/countyBounds.json').features;
    const popObj = formatPopulations();

    for (let geoObj of sourceArray) {

        const state = geoObj.properties.STATE;
        const geoid = geoObj.properties.STATE + geoObj.properties.COUNTY;
        const population = popObj[geoid]; 

        geoObj.properties.geoid = geoid;
        geoObj.properties.population = population;
        geoObj.properties.name = geoObj.properties.NAME;
        
        delete geoObj.properties.GEO_ID;
        delete geoObj.properties.STATE;
        delete geoObj.properties.COUNTY;
        delete geoObj.properties.NAME;
        delete geoObj.properties.LSAD;
        delete geoObj.properties.CENSUSAREA;
        
        if (state in targetObj){
            targetObj[state].features.push(geoObj);
        } else {
            console.log('state', state)
        }
    }

    const json = JSON.stringify(targetObj);

    fs.writeFile('src/store/countyBoundaries.json', json, 'utf8', function(err) {
        if (err) throw err;
    });
}

buildFIPSmap()
formatPopulations()
populateGeoObj()

