const fs = require('fs');
const utils = require('./utils');

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
        if (simNum % 3 === 0) {
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

function parseScenario(dir, geoInput, severities, parameters) {
    // parse entire Scenario Directory
    const files = fs.readdirSync(dir)
        .filter(file => file !== '.DS_Store');
    const dates = utils.getDates(dir + files[0]);
    const headers = utils.getHeaders(dir + files[0]);
    const obj = utils.initObj(dates);

    for (let s = 0; s < severities.length; s ++) {
        console.log('-> severity', severities[s])
        const filesBySev = utils.returnFilesBySev(files, severities[s]); // .slice(0,2); // shorten
        const [series, getIdx] = utils.initSeries(headers, parameters);
        const simNums = [];

        // must parse sims together on stat and sev level before conversion
        for (let i = 0; i < filesBySev.length; i ++) {
            parseSim(
                dir + filesBySev[i],
                series,
                getIdx,
                simNums,
                geoInput,
                headers,
                parameters
            );
        }
 
        // converts Obj of Obj into Array of Obj as d3 prefers
        const d3series = utils.convertD3(simNums, parameters, series);

        // pops in d3series values into final obj
        const stats = Object.keys(d3series);
        for (let i = 0; i < stats.length; i++) {
            const statObj = obj[severities[s]][stats[i]];
            statObj.sims = d3series[stats[i]];

            // add peak of all sims in given stat
            const peak = Math.max.apply(null, statObj.sims.map(i => i.max));
            statObj.peak = peak;
        }
    };
    return obj;
};

module.exports = {
    parseGeoID: function parseGeoID(dir, geoInput, scenarios, severities, parameters) {
        // parse entire geoID
        console.log('start:', new Date()); 
        console.log('geoID:', geoInput); 

        const obj = {};
        for (let i = 0; i < scenarios.length; i ++) {
            console.log('---> parsing scenario...', scenarios[i])
            obj[scenarios[i]] = parseScenario(
                dir + scenarios[i] + '/', 
                geoInput, 
                severities,
                parameters
            );
        };

        return obj;
    }
}

// snippet for debugging this module
// const dir = 'src/store/sims/';
// const geoInput = '06085'; //'06019'; // '25017'; //'01081'; 
// const scenarios = fs.readdirSync(dir)
//     .filter(file => file !== '.DS_Store')
//     .slice(0,1); // shorten
// const severities = ['high', 'med', 'low'];
// const parameters = ['incidD','incidH','incidI','incidICU','incidVent'];

// module.exports.parseGeoID(dir, geoInput, scenarios, severities, parameters)