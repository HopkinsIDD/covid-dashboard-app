// TO RUN FILE: remove "type": "module" from package.json
// otherwise will receive Error [ERR_REQUIRE_ESM]
const fs = require('fs');
const parse = require('./parseGeoID');
// const quantiles = require('../store/quant06085.json');

function buildDataset(dir, geoInput, parameters) {
    // add in parquet, for example
    const obj = parse.parseGeoID(dir, geoInput, parameters);

    const json = JSON.stringify(obj);
    
    const path = 'src/store/geo' + geoInput + '_testing.json';
    fs.writeFile(path, json, 'utf8', function(err) {
        if (err) throw err;
        console.log('end:', new Date());
        console.log('parse complete!'); 
    });
}

const dir = 'src/store/sims/';
const geoInput = '06085'; //'06019'; // '25017'; //'01081'; 
const parameters = ['incidD','incidH','incidI','incidICU','incidVent'];

buildDataset(dir, geoInput, parameters)

