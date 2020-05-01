// TO RUN FILE: remove "type": "module" from package.json
const fs = require('fs');
// need to add a display/surpassed parameter in obj

function initSeries(headers, parameters) {
    // build initial series and index mapping 
    // of selected parameters inside raw data headers
    // return series: Array of Objects, getIdx: Obj
    let series = [];
    let getIdx = Object();

    for (let i = 0; i < parameters.length; i ++) {
        getIdx[parameters[i]] = headers.indexOf(parameters[i])
        const stat = parameters[i];
        series.push({
            [stat]: {},
        });
    }
    return [series, getIdx];
};

function initObj(dates) {
    // scenario object initialization
    return {
        'high': {
            'dates': dates,
            'series': []
        },
        'med': {
            'dates': dates,
            'series': []
        },
        'low': {
            'dates': dates,
            'series': [],
        }
    };    
};

function getDates(path) {
    // return Array of dates 
    let dates = new Set();

    try {
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);

        lines.forEach((line) => {
            const splitLine = line.split(',')
            const date = splitLine[0]

            // skip header and empty lines
            if (date.length > 1 && date !== 'time') {
                dates.add(date);
            }
        });
    } catch (err) {
        console.error(err);
    }
    // console.log('dates', Array.from(dates).sort())
    return Array.from(dates).sort();
}

function getHeaders(path) {
    // return Array of headers 
    let headers = [];

    try {
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);

        lines.forEach((line) => {
            const splitLine = line.split(',')
            const date = splitLine[0]
            if (date === 'time') {
                for (let i = 0; i < splitLine.length; i ++) {
                    headers.push(splitLine[i]);
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
    return headers;
}

function returnFilesBySev(files, severity) {
    const filesBySev = [];
    for (let i = 0; i < files.length; i++) {
        if (files[i].includes(severity)) {
            filesBySev.push(files[i]);
        };
    };
    return filesBySev;
};

function getQuartile(data, q) {
    // TODO: incorporate quartile to get confidence bounds
    data = data.sort((a, b) => {return a - b;});
    const position = ((data.length) - 1) * q;
    const base = Math.floor(position);
    const rest = position - base;
    if (data[base + 1] !== undefined) {
      return data[base] + rest * (data[base + 1] - data[base]);
    } else {
      return data[base];
    }
  };

function parseFile(path, series, getIdx, simNums, geoInput, headers, parameters) {
    // mutates a series (Array of Object) by adding new parsed File info
    // parses one geoInput
    try {
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);
        const fileName = path.split('/').splice(-1).pop()
        const simNum = parseInt(fileName.split('_death-')[1].split('.')[0]);

        // reduce simulations down to 30%
        if (simNum % 3 === 0) {
            console.log('sim', simNum)
            simNums.push(simNum);
    
            lines.forEach((line) => {
                const splitLine = line.split(',')
                const date = splitLine[0]
                const geoid = splitLine[headers.indexOf('geoid')];
    
                if (geoid === geoInput) {
                    // skip header and empty lines
                    if (date.length > 1 && date !== 'time') {
    
                        for (let i = 0; i < parameters.length; i ++) {
                            const stat = parameters[i]; 
                            const val = parseInt(splitLine[getIdx[stat]]);
    
                            if (simNum in series[i][stat]) {
                                series[i][stat][simNum]['vals'].push(val);
                            } else {
                                series[i][stat][simNum] = {'name': simNum, 'vals': [val]};
                            }
                        }
                    }
                }
            });
        }
    } catch (err) {
        console.error(err);
    };
};

function convertD3(simNums, parameters, series) {
    // convert series to d3 friendly array
    const seriesD3 = {
        'incidI': [],
        'incidH': [],
        'incidD': [],
        'incidVent': [],
        'incidICU': []
    };

    for (let i = 0; i < parameters.length; i ++) {
        const stat = parameters[i]; 
        const simList = Array.from(simNums).sort(function(a, b) {return a-b});
        for (let j = 0; j < simList.length; j ++) {
            const simObj = series[i][stat][simList[j]];
            simObj.over = false;
            seriesD3[stat].push(simObj)
        }
    };  

    return seriesD3;
}

function parseDirectory(dir, geoInput, parameters) {
    // parse entire Scenario Directory
    const files = fs.readdirSync(dir).filter(file => file !== '.DS_Store');
    const sevList = ['high', 'med', 'low']

    const dates = getDates(dir + files[0]);
    const headers = getHeaders(dir + files[0]);
    const obj = initObj(dates);

    for (let s = 0; s < sevList.length; s ++) {
        console.log('-> severity', sevList[s])
        const filesBySev = returnFilesBySev(files, sevList[s]); //.slice(0,5);
        const [series, getIdx] = initSeries(headers, parameters);
        const simNums = [];

        for (let i = 0; i < filesBySev.length; i ++) {
            parseFile(dir + filesBySev[i], series, getIdx, simNums, geoInput, headers, parameters);
        }
        // console.log('severity final series', series)
        obj[sevList[s]].series = convertD3(simNums, parameters, series);
        // console.log('D3 series', convertD3(simNums, parameters, series))
    };
    return obj;
};

function parseSims(dir, geoInput, parameters) {
    console.log('start:', new Date()); // 4:39PM
    const scenarios = fs.readdirSync(dir).filter(file => file !== '.DS_Store');
    const obj = {};

    for (let i = 0; i < scenarios.length; i ++) {
        console.log('---> parsing scenario...', scenarios[i])
        obj[scenarios[i]] = parseDirectory(dir + scenarios[i] + '/', geoInput, parameters);
    };
    const json = JSON.stringify(obj);
    
    const path = 'src/store/geo' + geoInput + '_combed.json';
    fs.writeFile(path, json, 'utf8', function(err) {
        if (err) throw err;
        console.log('end:', new Date());
        console.log('parse complete!'); 
    });

}

const geoInput = '06085';
const parameters = ['incidI','incidH','incidD','incidVent','incidICU'];
parseSims('src/store/sims/', geoInput, parameters);
