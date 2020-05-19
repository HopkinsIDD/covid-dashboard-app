const fs = require('fs');
const constants = require('./constants');

// TODO: build out a geomain.py that runs geostat and geomap with the full geoids list
// Builds statistic json to be joined to county boundaries for Map COmponent

module.exports = {
    initStatGeoObj: function initStatGeoObj(states, geoids) {
        // build structure of Object for GeoMap data
        const obj = {};
    
        for (let state of states) {
            obj[state] = {};
    
            for (let geoid of geoids) {
    
                if (geoid.slice(0, 2) === state) {
                    obj[state][geoid] = {};
    
                    for (let param of constants.parameters) {
                        obj[state][geoid][param] = [];
                    }    
                }
            }
        }
    
        return obj;
    },
    
    buildGeoMapData: function buildGeoMapData(parsedObj) {
    // returns Object of statistic data to join into GeoJSON Boundary Collection
    // inside MapContainer of react app

    const geoids = Object.keys(parsedObj);
    const states = [...new Set(geoids.map(geoid => geoid.slice(0, 2)))];
    const geoObj = module.exports.initStatGeoObj(states, geoids);

    for (let geoid of geoids) {
        // TODO: determine if populating based on first scenario is fine
        const scenarios = Object.keys(parsedObj[geoid]);
        const scenario = scenarios.length > 0 ? scenarios[0] : console.log('no scenarios!');

        for (let param of constants.parameters) {
            const statArray = parsedObj[geoid][scenario].high[param].conf.p50;
            geoObj[geoid.slice(0, 2)][geoid][param] = statArray;
        }
    }

    const json = JSON.stringify(geoObj);

    fs.writeFileSync('src/store/geoStatsForMap.json', json, 'utf8', function(err) {
        if (err) throw err;
    });
    }
}

// module.exports.buildGeoMapData()
