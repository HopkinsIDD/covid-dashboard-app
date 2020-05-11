const fs = require('fs');
const utils = require('./utils');
const quantiles = require('../store/quant06085.json');

// need to add a display/surpassed parameter in obj

function parseSim(path, series, getIdx, simNums, geoInput, headers, parameters) {
    // mutates a series (Array of Object) by adding new parsed Simulation File info
    // parses one simulation of one geoInput
    try {
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);
        const fileName = path.split('/').splice(-1).pop()
        const simNum = parseInt(fileName.split('_death-')[1].split('.')[0]);

        // reduce simulations down to 30%
        // if (simNum % 3 === 0) {
        if (simNum) {
            console.log('sim', simNum)
            simNums.push(simNum);
    
            lines.forEach((line) => {
                const splitLine = line.split(',')
                const date = splitLine[0]
                const geoid = splitLine[headers.indexOf('geoid')];
    
                if (geoid === geoInput) {
                    // skip header and empty lines
                    if (date.length > 1 && date !== 'time') {
    
                        for (let i = 0; i < parameters.length; i ++) {
                            const stat = parameters[i]; 
                            const val = parseInt(splitLine[getIdx[stat]]);
    
                            if (simNum in series[i][stat]) {
                                series[i][stat][simNum]['vals'].push(val);
                            } else {
                                series[i][stat][simNum] = {'name': simNum, 'vals': [val]};
                            }
                        }
                    }
                }
            });
        }
    } catch (err) {
        console.error(err);
    };
};

function parseScenario(dir, geoInput, parameters) {
    // parse entire Scenario Directory
    const files = fs.readdirSync(dir).filter(file => file !== '.DS_Store');
    const sevList = ['high', 'med', 'low']

    const dates = utils.getDates(dir + files[0]);
    const headers = utils.getHeaders(dir + files[0]);
    const obj = utils.initObj(dates);

    for (let s = 0; s < sevList.length; s ++) {
        console.log('-> severity', sevList[s])
        const filesBySev = utils.returnFilesBySev(files, sevList[s]).slice(0,2); // shorten
        const [series, getIdx] = utils.initSeries(headers, parameters);
        const simNums = [];

        // must parse sims together on stat and sev level before conversion
        for (let i = 0; i < filesBySev.length; i ++) {
            parseSim(dir + filesBySev[i], series, getIdx, simNums, geoInput, headers, parameters);
        }
 
        // converts Obj of Obj into Array of Obj as d3 prefers
        const d3series = utils.convertD3(simNums, parameters, series);

        // pops in d3series values into final obj
        const stats = Object.keys(d3series);
        for (let i = 0; i < stats.length; i++) {
            obj[sevList[s]][stats[i]]['sims'] = d3series[stats[i]];
        }
    };
    return obj;
};

module.exports = {
    parseGeoID: function parseGeoID(dir, geoInput, parameters) {
        // parse entire geoID
        console.log('start:', new Date()); 
        console.log('geoID:', geoInput); 
        const scenarios = fs.readdirSync(dir).filter(file => file !== '.DS_Store').slice(0,1); // shorten
        const obj = {};
    
        for (let i = 0; i < scenarios.length; i ++) {
            console.log('---> parsing scenario...', scenarios[i])
            obj[scenarios[i]] = parseScenario(dir + scenarios[i] + '/', geoInput, parameters);
            console.log(typeof quantiles);

            // add in quantiles - will incorporate into loop once processed file arrives
            // current quantile file is not in d3 friendly format, convert, append like so and
            // try to add into module ... will need to edit initialization of dataset, etc
            obj[scenarios[i]]['high']['incidI']['conf'] = quantiles[scenarios[i]]['high']['incidI'];
        };
        return obj;
    }
}

//delete later, just for testing
const dir = 'src/store/sims/';
const geoInput = '06085'; //'06019'; // '25017'; //'01081'; 
const parameters = ['incidD','incidH','incidI','incidICU','incidVent'];

module.exports.parseGeoID(dir, geoInput, parameters)
