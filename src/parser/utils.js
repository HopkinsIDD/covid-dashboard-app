const fs = require('fs');
const constants = require('./constants');

module.exports = {

    initObj: function initObj(geoids, scenarios, severities, parameters, dates) {
        // build structure of final Object
        const obj = {};

        for (let g = 0; g < geoids.length; g ++) {
            obj[geoids[g]] = {};

            for (let s = 0; s < scenarios.length; s ++) {
                obj[geoids[g]][scenarios[s]] = {'dates': dates};
    
                for (let v = 0; v < severities.length; v ++) {
                    obj[geoids[g]][scenarios[s]][severities[v]] = {};
        
                    for (let p = 0; p < parameters.length; p ++) {
                        obj[geoids[g]][scenarios[s]][severities[v]][parameters[p]] = {
                            "peak": 0,
                            "sims": {},
                            "conf": {}
                        };
            
                    }    
                }
            }
        }

        return obj;
    },

    getIdx: function getIdx(headers, parameters) {
        // build index mapping of selected parameters inside raw data headers
        // assumes header order may change over time

        let getIdx = Object();
        getIdx['geoid'] = headers.indexOf('geoid')
        getIdx['sim_num'] = headers.indexOf('sim_num')

        for (let i = 0; i < parameters.length; i ++) {
            getIdx[parameters[i]] = headers.indexOf(parameters[i])
        }
        return getIdx;
    },


    getDates: function getDates(dir, scenarios) {
        // parameter dir is entire model package directory
        // return Array of dates 

        const files = fs.readdirSync(dir + scenarios[0] + '/',)
            .filter(file => file !== '.DS_Store');

        let dates = new Set();
        try {
            const path = dir + scenarios[0] + '/' + files[0]
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
            console.error(`No scenario directories: ${dir}`);
        }
        return Array.from(dates).sort();
    },

    getHeaders: function getHeaders(path) {
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
    },

    notHeaderOrEmpty: function notHeaderOrEmpty(line) {
        // return true if line is not header or empty lines at end

        const splitLine = line.split(',')
        const date = splitLine[0];

        return date.length > 1 && date !== 'time'

    },

    returnFilesBySev: function returnFilesBySev(files, severity) {
        // returns Array of file names for given severity type

        const filesBySev = [];
        for (let i = 0; i < files.length; i++) {
            if (files[i].includes(severity)) {
                filesBySev.push(files[i]);
            };
        };
        return filesBySev;
    },

    reduceSims: function reduceSims(fileLength) {
        // returns int a sim number must be divisible by
        // in order to be included in final dataset
        // fileLength is length of files in scenario directory
        // includes all severities

        if (fileLength < 60) {
            return 1;
        } else if (fileLength <= 120) {
            return 2;
        } else if (fileLength <= 200) {
            return 3;
        } else if (fileLength <= 300) {
            return 4;
        } else {
            return 5;
        }
    },

    writeToFile: function writeToFile(parsedObj, geoids) {
        // each geoid will write to separate JSON file

        console.log('... writing files')
        for (let g = 0; g < geoids.length; g ++) {
            const json = JSON.stringify(parsedObj[geoids[g]]);
            const path = `src/store/geo${geoids[g]}_NEW.json`;
    
            fs.writeFile(path, json, 'utf8', function(err) {
                if (err) throw err;
            });
        }
    }    
}

// const dir = 'src/store/sims/';
// const geoids = ['06085', '06019']; //'06019'; // '25017'; //'01081'; 
// const scenarios = fs.readdirSync(dir)
//     .filter(file => file !== '.DS_Store')
//     //.slice(0,1); // shorten
// const severities = ['high', 'med', 'low'];
// const parameters = ['incidD','incidH','incidI','incidICU','incidVent'];

// const dates = ['the dates are here'];
// const obj = module.exports.initObj(geoids, scenarios, severities, parameters, dates);

// console.log(obj)
