// TO RUN FILE: remove "type": "module" from package.json
// otherwise will receive Error [ERR_REQUIRE_ESM]
const fs = require('fs');
const parse = require('./parseGeoID');
const quant = require('./mergeQuantiles');
const quantiles = require('../store/quant06085.json');

function buildDataset(dir, geoInput) {

    const scenarios = fs.readdirSync(dir)
        .filter(file => file !== '.DS_Store');
        //.slice(0,1); // shorten for testing
    const severities = ['high', 'med', 'low'];
    const parameters = ['incidD','incidH','incidI','incidICU','incidVent'];
    const quantIntervals = ['p10', 'p50', 'p90'];

    // TODO: readParquet.js
    const obj = parse.parseGeoID(dir,
        geoInput,
        scenarios,
        severities,
        parameters
    );
    const objQuant = quant.mergeQuantiles(
        obj,
        scenarios,
        severities,
        parameters,
        quantIntervals,
        quantiles
    );

    const json = JSON.stringify(objQuant);
    
    const path = 'src/store/geo' + geoInput + '_new.json';
    fs.writeFile(path, json, 'utf8', function(err) {
        if (err) throw err;
        console.log('end:', new Date());
        console.log('parse complete!'); 
    });
}

const dir = 'src/store/sims/';
const geoInput = '25017'; //'01081'; '06085'; // '06019'; // 

buildDataset(dir, geoInput)

