const fs = require('fs');
const utils = require('./utils');
const constants = require('./constants');

function parseSim(path, result, geoids, scenario, sev, dates, getIdx) {
    // returns Object of Array series of sim values by geoID
    // getIdx: Obj index mapping of selected parameters
    // reduceInt: int that sim must be divisible by to be included in final set
    
    try {
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);
        let aggDate = dates[0];
    
        for (let line of lines) {
            const geoid = line.split(',')[getIdx['geoid']];
            const sim = line.split(',')[getIdx['sim_num']];
            const date = line.split(',')[getIdx['time']];
            
            // only include specified geoid
            if (geoids.includes(geoid) && utils.notHeaderOrEmpty(line)) {

                for (let param of constants.parameters) {
                    if (param === 'incidI') {
                        const val = parseInt(line.split(',')[getIdx[param]]);
                        
                        // populate by simulation
                        const simObj = result[geoid][scenario][sev][param]['sims']
    
                        if (!(sim in simObj)) {
                            simObj[sim] = [val];
                        } else {
                            simObj[sim].push(val);
                        }
    
                        // aggregate on state-level
                        const state = geoid.slice(0, 2);
                        const stateObj = result[state][scenario][sev][param]['sims'];
    
                        // first value in sim file
                        if (!(sim in stateObj)) {
                            stateObj[sim] = [val];
                        // aggregate if its the same date
                        } else if (aggDate === date) { 
                            const idx = dates.indexOf(date);
                            stateObj[sim][idx] = stateObj[sim][idx] + val;
                        // push if its a new date
                        } else { 
                            stateObj[sim].push(val);
                            aggDate = date;
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
    parseDirectories: function parseDirectories(dir, geoids, scenarios, dates) {
        // parses entire model package of multiple scenario dirs, returns result Obj

        console.log('start:', new Date()); 
        const result = utils.initObj(geoids, scenarios, dates);
            
        for (let scenario of scenarios) {
            console.log('-----> parsing scenario...', scenario)

            const scenarioDir = `${dir}${scenario}/`;
            const files = fs.readdirSync(scenarioDir)
                .filter(file => file !== '.DS_Store');
                // .slice(0, 3);

            // get index mapping based on parameters and headers
            let getIdx = {};
            if (files.length > 0) {
                const headers = utils.getHeaders(`${scenarioDir}${files[0]}`);
                getIdx = utils.getIdx(headers, constants.parameters); 
            } else {
                console.log(`No files in directory: ${scenarioDir}`)
            }

            // parse by sim file
            for (let file of files) {
                const severity = file.split('_')[0];
                const filePath = scenarioDir + file;
                console.log(severity)

                parseSim(
                    filePath, result, geoids, scenario, severity, dates, getIdx)
            }
        };

        return result;
    }
}
