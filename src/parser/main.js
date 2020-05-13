// TO RUN FILE
// remove "type": "module" from package.json (receive Error [ERR_REQUIRE_ESM])

// TO TEST
// shorten scenarios and files to run
// remove simulation reduction to 30%

// ASSUMPTIONS 
// one scenario per directory with 3 severity levels 
// file format looks like "high_death-1.csv"
// severity is first word, sim number is last word

const fs = require('fs');
const parse = require('./parse');
const utils = require('./utils');
const constants = require('./constants');
const quant = require('./quantiles');
const quantilesFile = require('../store/quant06085.json');

function buildDataset() {
    const dir = 'src/store/sims/';
    const geoids = ['06085', '06019']; //'25017'; //'01081'; '06085'; // '06019'; // 
    const scenarios = fs.readdirSync(dir)
        .filter(file => file !== '.DS_Store')
        .slice(0,1); 
        
    const severities = constants.severities;
    const parameters = constants.parameters;
    const quantiles = constants.quantiles;

    // faster to getDates from the get-go
    let dates = [];
    if (scenarios.length > 0) {
        const files = fs.readdirSync(dir + scenarios[0] + '/',)
            .filter(file => file !== '.DS_Store');
        dates = utils.getDates(dir + scenarios[0] + '/' + files[0]);
    } else {
        console.log(`No scenario directories: ${dir}`)
    }

    // TODO: readParquet.js
    const parsedObj = parse.parseDirectories(dir,
        geoids,
        scenarios,
        severities,
        parameters,
        dates
    );

    quant.mergeQuantiles(
        parsedObj,
        geoids,
        scenarios,
        severities,
        parameters,
        quantiles,
        quantilesFile
    );

    console.log('writing files...')
    for (let g = 0; g < geoids.length; g ++) {
        // write to file by geoid
        const json = JSON.stringify(parsedObj[geoids[g]]);
        const path = 'src/store/geo' + geoids[g] + '_test.json';

        fs.writeFile(path, json, 'utf8', function(err) {
            if (err) throw err;
        });
    }
    console.log('end:', new Date());
    console.log('parse complete!'); 
}

buildDataset()

