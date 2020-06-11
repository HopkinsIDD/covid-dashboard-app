const fs = require('fs');
const _ = require('lodash');

// TODO: add Actual file validation - expected columns, file type is .csv

function initActualObj(geoids, params) {
    const obj = {};
    for (let param of params) {
        obj[param] = {};

        for (let geoid of geoids) {
            obj[param][geoid] = [];
        }
    } 
    return obj;
}

function readActual(path, obj, geoids, params) {
    // TODO: only set up for death actual data

    try {
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);

        lines.forEach((rawLine) => {
            const line = rawLine.split(',')
            const geoid = line[1], date = line[2], val = parseInt(line[3]);

            // skip header and geoids we don't care about
            if (line[0] === 'index' || !geoids.includes(geoid)) return

            for (let param of params) {

                obj[param][geoid].push({date, val});
            }
        });
    } catch (err) {
        console.error(`Error reading actual data`);
    }
}

function aggregateActualByState(obj, states, geoids, params) {
    // aggregates geoids by state and adds to final obj

    const dates = obj['deaths']['06019'].map(i => i.date); // array of dates

    // add state keys to obj
    for (let param of params) {
        
        for (let state of states) {
            let vals = [];
            obj[param][state] = [];

            // geoids for given state
            const geoidsByState = geoids.filter(geoid => geoid.slice(0, 2) === state);
            for (let geoid of geoidsByState) {

                if (vals.length === 0) {
                    vals = _.cloneDeep(obj[param][geoid].map(i => i.val));
                } else {
                    const newVals = obj[param][geoid].map(i => i.val);
                    
                    for (let i = 0 ; i < dates.length; i++) {
                        vals[i] = vals[i] + newVals[i];
                    }
                }
            }

            for (let i = 0 ; i < dates.length; i++) {
                const date = dates[i];
                const val = vals[i]; 
                obj[param][state].push({date, val})
            }
        }
    }
}

module.exports = {
    initActualObj,
    readActual,
    aggregateActualByState
};

// all CA and NY counties 
const geoids = [
    '06001', '06003', '06003', '06005', '06007', '06009', '06011', '06013', '06015', '06017', 
    '06019', '06021', '06023', '06025', '06027', '06029', '06031', '06033', '06035', 
    '06037', '06039', '06041', '06043', '06045', '06047', '06049', '06051', '06053', 
    '06055', '06057', '06059', '06061', '06063', '06065', '06067', '06069', '06071', 
    '06073', '06075', '06077', '06079', '06081', '06083', '06085', '06087', '06089', 
    '06091', '06093', '06095', '06097', '06099', '06101', '06103', '06105', '06107', 
    '06109', '06111', '06113', '06115',
    '36001', '36003', '36005', '36007', '36009', '36011', '36013', '36015', '36017', 
    '36019', '36021', '36023', '36025', '36027', '36029', '36031', '36033', '36035', 
    '36037', '36039', '36041', '36043', '36045', '36047', '36049', '36051', '36053', 
    '36055', '36057', '36059', '36061', '36063', '36065', '36067', '36069', '36071', 
    '36073', '36075', '36077', '36079', '36081', '36083', '36085', '36087', '36089', 
    '36091', '36093', '36095', '36097', '36099', '36101', '36103', '36105', '36107', 
    '36109', '36111', '36113', '36115', '36117', '36119', '36121', '36123']
const params = ['deaths'];
const states = ['06', '36'];

const path = '/Users/lxu213/Documents/covid-dashboard-app/src/store/USAFacts.csv';
const obj = initActualObj(geoids, params);

// TODO: add to main.py once pipeline is figured out
readActual(path, obj, geoids, params);
aggregateActualByState(obj, states, geoids, params)

const json = JSON.stringify(obj);
fs.writeFileSync('src/store/actuals.json', json, 'utf8', function(err) {
    if (err) throw err;
});