const fs = require('fs');
const _ = require('lodash');
// const constants = require('./constants');

function initObj(geoids, scenarios, severities, parameters, dates) {
    // build structure of final Object
    const obj = {};

    for (let geoid of geoids) {
        obj[geoid] = {};

        for (let scenario of scenarios) {
            obj[geoid][scenario] = {'dates': dates};

            for (let sev of severities ) {
                obj[geoid][scenario][sev] = {};
    
                for (let param of parameters) {
                    obj[geoid][scenario][sev][param] = {
                        'peak': 0,
                        'sims': {},
                        'conf': {}
                    };
                }    
            }
        }
    }
    return obj;
}
    
function getIdx(headers, parameters) {
    // build index mapping of selected parameters inside raw data headers
    // assumes header order may change over time

    let getIdx = Object();
    getIdx['geoid'] = headers.indexOf('geoid')
    getIdx['sim_num'] = headers.indexOf('sim_num')
    getIdx['time'] = headers.indexOf('time')

    for (let i = 0; i < parameters.length; i ++) {
        getIdx[parameters[i]] = headers.indexOf(parameters[i])
    }
    return getIdx;
}

function getDates(dir, scenarios) {
    // parameter dir is entire model package directory
    // return Array of dates 

    const files = fs.readdirSync(dir + scenarios[0] + '/',)
        .filter(file => file !== '.DS_Store');

    let dates = new Set();
    try {
        const path = dir + scenarios[0] + '/' + files[0]
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);

        lines.forEach((line) => {
            const splitLine = line.split(',')
            const date = splitLine[0]

            // skip header and empty lines
            if (date.length > 1 && date !== 'time') {
                dates.add(date);
            }
        });
    } catch (err) {
        console.error(`No scenario directories: ${dir}`);
    }
    return Array.from(dates).sort();
}

function getHeaders(path) {
    // return Array of headers 
    let headers = [];

    try {
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);

        lines.forEach((line) => {
            const splitLine = line.split(',')
            const date = splitLine[0]
            if (date === 'time') {
                for (let i = 0; i < splitLine.length; i ++) {
                    headers.push(splitLine[i]);
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
    return headers;
}

function notHeaderOrEmpty(line) {
    // return true if line is not header or empty lines at end

    const splitLine = line.split(',')
    const date = splitLine[0];

    return date.length > 1 && date !== 'time'

}

function returnFilesBySev(files, severity) {
    // returns Array of file names for given severity type

    const filesBySev = [];
    for (let i = 0; i < files.length; i++) {
        if (files[i].includes(severity)) {
            filesBySev.push(files[i]);
        };
    };
    return filesBySev;
}

function aggregateByState(parsedObj, finalObj, states, geoids, scenarios, severities, parameters, dates) {
    // finalObj: initialized Obj with states as keys
    // parsedObj: object with all parsed data, finalObj to be added to this Obj
    // add state geoid with sims aggregated by county geoid to parsedObj

    for (let state of states) {

        for (let geoid of geoids) { 

            for (let scen of scenarios) {

                for (let sev of severities ) {

                    for (let param of parameters) {

                        if (Object.keys(finalObj[state][scen][sev][param].sims).length === 0) {
                            finalObj[state][scen][sev][param].sims = _.cloneDeep(parsedObj[geoid][scen][sev][param].sims);

                        } else {
                            const sims = Object.keys(parsedObj[geoid][scen][sev][param].sims);

                            for (let sim of sims) {

                                for (let i = 0 ; i < dates.length; i++) {
                                    const val = parsedObj[geoid][scen][sev][param].sims[sim][i]; 
                                    finalObj[state][scen][sev][param].sims[sim][i] = finalObj[state][scen][sev][param].sims[sim][i] + val;
                                }
                            }
                        }

                    }     
                }   
            }
        }
        parsedObj[state] = finalObj[state];
    }
}

function returnR0(dir, scenario, severity, sim) {
    // TODO: filename and structure will probably need to be changed

    const zeros = '0'.repeat(9 - sim.toString().length);
    const path = `src/store/model_parameters/`
    const fileName = `${scenario}_${severity}-${zeros}${sim}.spar.csv`;

    // return value of R0
    try {
        const data = fs.readFileSync(`${path}${fileName}`, 'UTF-8');
        const lines = data.split(/\r?\n/);
    
        for (let line of lines) {
            const lineArray = line.split(',');
            if (lineArray[1] === 'R0') {
                return parseFloat(parseFloat(lineArray[0]).toFixed(2));
            }
        }
    } catch (err) {
        console.error(err);
    };
}

// function calcReduceInt(fileLength) {
//     // returns int a sim number must be divisible by
//     // in order to be included in final dataset
//     // fileLength is length of files in scenario directory
//     // includes all severities

//     if (fileLength < 60) {
//         return 1;
//     } else if (fileLength <= 120) {
//         return 2;
//     } else if (fileLength <= 200) {
//         return 3;
//     } else if (fileLength <= 300) {
//         return 4;
//     } else {
//         return 5;
//     }
// }

// function reduceSims(dir, parsedObj) {
//     // reduce number of sims based on sim files per scenario
    
//     const geoids = Object.keys(parsedObj);
//     for (let geoid of geoids) {

//         const scenarios = Object.keys(parsedObj[geoid]);
//         for (let scenario of scenarios) {

//             const files = fs.readdirSync(`${dir}${scenario}/`)
//                 .filter(file => file !== '.DS_Store');
//             const reduceInt = module.exports.calcReduceInt(files.length);
//             for (let sev of constants.severities) {

//                 for (let param of constants.parameters) {

//                     const newSims = parsedObj[geoid][scenario][sev][param].sims
//                         .filter(sim => sim.name % reduceInt === 0);
//                     parsedObj[geoid][scenario][sev][param].sims = newSims;
//                 }
//             }
//         }
//     }
// }

function writeToFile(parsedObj, geoids) {
    // each geoid will write to separate JSON file

    // const geoids = Object.keys(parsedObj);
    console.log('... writing files')
    for (let g = 0; g < geoids.length; g ++) {
        const json = JSON.stringify(parsedObj[geoids[g]]);
        const path = `src/store/geo${geoids[g]}.json`;

        fs.writeFileSync(path, json, 'utf8', function(err) {
            if (err) throw err;
        });
    }
}

function combineCaliCounties() {
    // Add renamed scenarios of geo06019 to geo06085

    const geo06019 = require('../store/geo06019.json');
    const oldKeys = Object.keys(geo06019);
    const newKeys = ['Scenario_D', 'Scenario_E', 'Scenario_F'];
    
    // rename scenarios of geo06019
    for (let i = 0; i < oldKeys.length; i ++) {
        Object.defineProperty(geo06019, newKeys[i],
            Object.getOwnPropertyDescriptor(geo06019, oldKeys[i]));
        delete geo06019[oldKeys[i]];
    }

    // add renamed scenarios to geo06085
    const geo06085 = require('../store/geo06085.json');
    for (let key of newKeys) {
        geo06085[key] = geo06019[key];
    }
    
    const json = JSON.stringify(geo06085);
    const path = `src/store/geo06085.json`;

    fs.writeFileSync(path, json, 'utf8', function(err) {
        if (err) throw err;
    });
}

module.exports = {
    initObj,
    getIdx,
    getDates,
    getHeaders,
    notHeaderOrEmpty,
    returnFilesBySev,
    aggregateByState,
    returnR0,
    // calcReduceInt,
    // reduceSims,
    writeToFile,
    combineCaliCounties
}
