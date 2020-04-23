const fs = require('fs');

// const path = 'src/store/sims/USA_LockdownUK/'

// TODO: read header (first line only) to process idx of parameters
const headers = ['time', 'uid', 'geoid','sim_num', 'comp', 'incidI', 'hosp_curr', 'icu_curr', 
    'vent_curr', 'incidH', 'incidICU',  'incidVent', 'incidD', 'date_inds', 'geo_ind'];
const parameters = [
    'incidI',
    'incidH',
    'incidD',
    'incidVent',
    'incidICU',
];

let dates = [];
let series = [];
let getIdx = Object();
let simNums = new Set();

for (let i = 0; i < parameters.length; i ++) {
    getIdx[parameters[i]] = headers.indexOf(parameters[i])
    // const stat = parameters[i];
    // series.push({
    //     stat: []
    // });
}
// do this for now
series.push({'incidI': {}})
series.push({'incidH': {}})
series.push({'incidD': {}})
series.push({'incidVent': {}})
series.push({'incidICU': {}})


try {
    // const data = fs.readFileSync('src/store/sims/USA_Lockdown1918/high_death-1.csv', 'UTF-8');
    // TODO: geo06085 is all high severity data for one county for one scenario. need to bring in all severity and all scenarios.
    const data = fs.readFileSync('src/store/geo06085.csv', 'UTF-8');
    const lines = data.split(/\r?\n/);

    lines.forEach((line) => {
        const splitLine = line.split(',')
        const date = splitLine[0]
        const idxSim = headers.indexOf('sim_num');

        // skip header and empty lines
        if (date.length > 1 && date !== 'time') {
            const simNum = parseInt(splitLine[idxSim]);
            simNums.add(simNum);

            if (simNum === 1) {
                dates.push(date);
            }

            for (let i = 0; i < parameters.length; i ++) {
                const stat = parameters[i]; 
                const val = parseInt(splitLine[getIdx[stat]]);

                if (simNum in series[i][stat]) {
                    series[i][stat][simNum]['values'].push(val);
                } else {
                    series[i][stat][simNum] = {'name': simNum, 'values': [val]};
                }
            }
        }
    });
} catch (err) {
    console.error(err);
}

// convert to d3 friendly array
const seriesD3 = {
    'incidI': [],
    'incidH': [],
    'incidD': [],
    'incidVent': [],
    'incidICU': []
}

for (let i = 0; i < parameters.length; i ++) {
    const stat = parameters[i]; 
    const simList = Array.from(simNums).sort(function(a, b) {return a-b});
    for (let j = 0; j < simList.length; j ++) {
        seriesD3[stat].push(series[i][stat][simList[j]])
    }
}

const obj = {
    'dates': dates,
    'series': seriesD3
};

const json = JSON.stringify(obj);

fs.writeFile('src/store/high_death.json', json, 'utf8', function(err) {
    if (err) throw err;
    console.log('complete');
});
