const fs = require('fs');

module.exports = {

    initObj: function initObj(geoids, scenarios, severities, parameters, dates) {
        // prepare structure of final Object
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

        for (let i = 0; i < parameters.length; i ++) {
            getIdx[parameters[i]] = headers.indexOf(parameters[i])
        }
        return getIdx;
    },


    getDates: function getDates(path) {
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
