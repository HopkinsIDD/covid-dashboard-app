const fs = require('fs');
const constants = require('./constants');

// TODO: build out a geomain.py that runs geostat and geomap with the full geoids list
// Builds statistic json to be joined to county boundaries for Map Component

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

// counties for demo (CA, AL, MA, NY)
const geoids = ['06001', '06003', '06005', '06007', '06009', '06011', '06013', 
    '06015', '06017', '06019', '06021', '06023', '06025', '06027', '06029', '06031', 
    '06033', '06035', '06037', '06039', '06041', '06043', '06045', '06047', '06049', 
    '06051', '06053', '06055', '06057', '06059', '06061', '06063', '06065', '06067', 
    '06069', '06071', '06073', '06075', '06077', '06079', '06081', '06083', '06085', 
    '06087', '06089', '06091', '06093', '06095', '06097', '06099', '06101', '06103', 
    '06105', '06107', '06109', '06111', '06113', '06115',
    '01001', '01003', '01005', '01007', '01009', '01011', '01013', '01015', '01017',
    '01019', '01021', '01023', '01025', '01027', '01029', '01031', '01033', '01035', 
    '01037', '01039', '01041', '01043', '01045', '01047', '01049', '01051', '01053', 
    '01055', '01057', '01059', '01061', '01063', '01065', '01067', '01069', '01071', 
    '01073', '01075', '01077', '01079', '01081', '01083', '01085', '01087', '01089', 
    '01091', '01093', '01095', '01097', '01099', '01101', '01103', '01105', '01107', 
    '01109', '01111', '01113', '01115', '01117', '01119', '01121', '01123', '01125', 
    '01127', '01129', '01131', '01133',
    '25001', '25003', '25005', '25007', '25009', '25011', '25013', '25015', '25017', 
    '25019', '25021', '25023', '25025', '25027',
    '36001', '36003', '36005', '36007', '36009', '36011', '36013', '36015', '36017', 
    '36019', '36021', '36023', '36025', '36027', '36029', '36031', '36033', '36035', 
    '36037', '36039', '36041', '36043', '36045', '36047', '36049', '36051', '36053', 
    '36055', '36057', '36059', '36061', '36063', '36065', '36067', '36069', '36071', 
    '36073', '36075', '36077', '36079', '36081', '36083', '36085', '36087', '36089', 
    '36091', '36093', '36095', '36097', '36099', '36101', '36103', '36105', '36107', 
    '36109', '36111', '36113', '36115', '36117', '36119', '36121', '36123']