const fs = require('fs');
const constants = require('./constants');
const _ = require('lodash');

// This script builds the actuals.json with actual data
// TODO: add Actual file validation - expected columns, file type is .csv

function initActualObj(geoids, params) {
    const obj = {};
    for (let param of params) {
        obj[param] = {};

        for (let geoid of geoids) {
            obj[param][geoid] = [];
        }
    } 
    return obj;
}

function readActual(path, obj, geoids, params) {
    // TODO: only set up for death actual data

    try {
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);

        lines.forEach((rawLine) => {
            const line = rawLine.split(',')
            const geoid = line[1], date = line[2], val = parseInt(line[3]);

            // skip header and geoids we don't care about
            if (line[0] === 'index' || !geoids.includes(geoid)) return

            for (let param of params) {

                obj[param][geoid].push({date, val});
            }
        });
    } catch (err) {
        console.error(`Error reading actual data`);
    }
}

function aggregateActualByState(obj, states, geoids, params) {
    // aggregates geoids by state and adds to final obj

    const dates = obj['deaths']['06019'].map(i => i.date); // array of dates

    // add state keys to obj
    for (let param of params) {
        
        for (let state of states) {
            let vals = [];
            obj[param][state] = [];

            // geoids for given state
            const geoidsByState = geoids.filter(geoid => geoid.slice(0, 2) === state);
            for (let geoid of geoidsByState) {

                if (vals.length === 0) {
                    vals = _.cloneDeep(obj[param][geoid].map(i => i.val));
                } else {
                    const newVals = obj[param][geoid].map(i => i.val);
                    
                    for (let i = 0 ; i < dates.length; i++) {
                        vals[i] = vals[i] + newVals[i];
                    }
                }
            }

            for (let i = 0 ; i < dates.length; i++) {
                const date = dates[i];
                const val = vals[i]; 
                obj[param][state].push({date, val})
            }
        }
    }
}

module.exports = {
    initActualObj,
    readActual,
    aggregateActualByState
};

const geoids = [].concat(constants.geoidsCA, constants.geoidsNY);
const params = ['deaths'];
const states = ['06', '36'];

const path = '/Users/lxu213/Documents/covid-dashboard-app/src/store/USAFacts.csv';
const obj = initActualObj(geoids, params);

// TODO: add to main.py once pipeline is figured out
readActual(path, obj, geoids, params);
aggregateActualByState(obj, states, geoids, params)

const json = JSON.stringify(obj);
fs.writeFileSync('src/store/actuals.json', json, 'utf8', function(err) {
    if (err) throw err;
});