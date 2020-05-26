const fs = require('fs');
const utils = require('./utils');
const constants = require('./constants');

function parseSim(path, result, geoids, scenario, sev, getIdx) {
    // returns Object of Array series of sim values by geoID
    // getIdx: Obj index mapping of selected parameters
    // reduceInt: int that sim must be divisible by to be included in final set
    
    try {
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);
    
        for (let line of lines) {
            const geoid = line.split(',')[getIdx['geoid']];
            const sim = line.split(',')[getIdx['sim_num']];
            
            // only include specified geoid
            if (geoids.includes(geoid) && utils.notHeaderOrEmpty(line)) {

                for (let param of constants.parameters) {
                    const val = parseInt(line.split(',')[getIdx[param]]);
                    const simObj = result[geoid][scenario][sev][param]['sims']

                    if (!(sim in simObj)) {
                        simObj[sim] = [val];
                    } else {
                        simObj[sim].push(val);
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
                    filePath, result, geoids, scenario, severity, getIdx)
            }
        };

        return result;
    }
}
