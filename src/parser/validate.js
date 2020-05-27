const fs = require('fs');
const path = require('path')
const utils = require('./utils');


function validateHeaders(file) {
    // raise error if headers of files don't include all parameters required 
    const headers = utils.getHeaders(file);
    const requiredParams = [
        'geoid', 'sim_num', 'time',
        'incidD', 'incidH', 'incidI', 'incidICU', 'incidVent'
    ];
    
    for (let param of requiredParams) {
        if (!headers.includes(param)) {
            console.error(`Required parameter ${param} does not exist in file header.`)
        }
    }
};

function validateFiles(dir) {
    // raise error if input files are faulty 

    const scenarios = fs.readdirSync(dir)
        .filter(file => file !== '.DS_Store'); 

    if (scenarios.length === 0) {
        console.error('No scenarios in model directory.')
    }

    for (let scenario of scenarios) {
        const scenarioDir = `${dir}${scenario}/`;
        const files = fs.readdirSync(scenarioDir)
            .filter(file => file !== '.DS_Store');
    
        if (files.length === 0) {
            console.error(`No simulation files in ${scenario} directory.`)
        }

        const filePath = `${scenarioDir}${files[0]}`;
        const fileType = path.extname(filePath)
        if (fileType !== '.csv') {
            console.error(`Simulation files need to be .csv`)
        }

        validateHeaders(filePath);
    }
};

// TODO
// validate all scenario files have same sim nums

// validate geoids from countyBounds exactly match geoids to process
// countyBound --> countyBounds['36'].features.map(f => f.properties.geoid).sort()
// statsForMap --> Object.keys(stats['36']).sort()
// need to be equal to each other!!

module.exports.validateFiles = validateFiles;
