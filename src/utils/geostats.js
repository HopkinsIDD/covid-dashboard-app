function initStatGeoObj(states, geoids, scenarios) {
    // build structure of Object for GeoMap data
    const obj = {};

    for (let state of states) {
        obj[state] = {};

        for (let geoid of geoids) {

            if (geoid.slice(0, 2) === state) {
                obj[state][geoid] = {};

                for (let scenario of scenarios) {
                    obj[state][geoid][scenario] = {};

                    for (let param of constants.parameters) {
                        obj[state][geoid][scenario][param] = [];
                    }    
                }
            }
        }
    }

    return obj;
}

function buildGeoMapData(parsedObj) {
// returns Object of statistic data to join into GeoJSON Boundary Collection
// inside MapContainer of react app

const geoids = Object.keys(parsedObj).filter(g => g.length === 5);
const states = Object.keys(parsedObj).filter(g => g.length === 2);
const scenarios = Object.keys(parsedObj[geoids[0]]);
const geoObj = module.exports.initStatGeoObj(states, geoids, scenarios);

for (let geoid of geoids) {

    for (let scenario of scenarios) {
        scenario = scenarios.length > 0 ? scenario : console.log('no scenarios!');

        for (let param of constants.parameters) {
            const statArray = parsedObj[geoid][scenario].high[param].conf.p50;
            geoObj[geoid.slice(0, 2)][geoid][scenario][param] = statArray;
        }
    }
}