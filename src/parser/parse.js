const fs = require('fs');
const utils = require('./utils');
const constants = require('./constants');
const transform = require('./transform');

function parseSim(path, result, geoids, scenario, severity, getIdx) {
    // returns Object of Array series of sim values by geoID
    // getIdx: Obj index mapping of selected parameters
    // reduceInt: int that sim must be divisible by to be included in final set
    
    try {
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);
    
            for (let l = 0; l < lines.length; l++) {
                const line = lines[l];
                const geoid = line.split(',')[getIdx['geoid']];
                const sim = line.split(',')[getIdx['sim_num']];
                
                // only include specified geoid
                if (geoids.includes(geoid)) {

                    if (utils.notHeaderOrEmpty(line)) {

                        const params = constants.parameters;
                        for (let p = 0; p < params.length; p ++) {

                            const param = params[p]; 
                            const val = parseInt(line.split(',')[getIdx[param]]);
                            const simObj = result[geoid][scenario][severity][param]['sims']

                            if (sim in simObj) {
                                simObj[sim].push(val);
                            } else {
                                simObj[sim] = [val];
                            }
                        }
                    }
                    
                }
            }

    } catch (err) {
        console.error(err);
    };
};

module.exports = {
    parseDirectories: function parseDirectories(
        dir, geoids, scenarios, dates) {
        // parses entire model package of multiple scenario directories
        // returns result Object

        console.log('start:', new Date()); 
        
        const severities = constants.severities;
        const parameters = constants.parameters;
        const result = utils.initObj(
            geoids, scenarios, severities, parameters, dates);
            
        for (let s = 0; s < scenarios.length; s ++) {
            console.log('-----> parsing scenario...', scenarios[s])

            const scenarioDir = `${dir}${scenarios[s]}/`;
            const files = fs.readdirSync(scenarioDir)
                .filter(file => file !== '.DS_Store')
                //.slice(0, 5);

            // get index mapping based on parameters and headers
            let getIdx = {};
            if (files.length > 0) {
                const headers = utils.getHeaders(`${scenarioDir}${files[0]}`);
                getIdx = utils.getIdx(headers, parameters); 
            } else {
                console.log(`No files in directory: ${scenarioDir}`)
            }

            // parse by sim file
            for (let f = 0; f < files.length; f ++) {
                const severity = files[f].split('_')[0];
                const filePath = scenarioDir + files[f];
                console.log(severity)

                parseSim(
                    filePath, result, geoids, scenarios[s], severity, getIdx)
            }
        };

        // transform each simObj to D3-friendly format
        transform.toD3format(result, geoids, scenarios);

        return result;
    }
}

// snippet for debugging this module
// const dir = 'store/sims/';
// const geoInput = ['06085', '06019']; //'06019'; // '25017'; //'01081'; 
// const scenarios = fs.readdirSync(dir)
//     .filter(file => file !== '.DS_Store')
//     .slice(0,1); // shorten

// // faster to getDates from the get-go
// let dates = [];
// if (scenarios.length > 0) {
//     const files = fs.readdirSync(dir + scenarios[0] + '/',)
//         .filter(file => file !== '.DS_Store');
//     dates = utils.getDates(dir + scenarios[0] + '/' + files[0]);
// } else {
//     console.log(`No scenario directories: ${dir}`)
// }

// const result = module.exports.parseDirectories(
//     dir,
//     geoInput,
//     scenarios,
//     constants.severities,
//     constants.parameters,
//     dates
//     )