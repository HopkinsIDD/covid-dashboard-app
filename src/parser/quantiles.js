const constants = require('./constants');

module.exports = {
    addQuantiles: function addQuantiles(parsedObj, dates) {
        // calculate p10, p50, p90 quantiles and add to parsedObj
    
        const geoids = Object.keys(parsedObj);
        for (let geoid of geoids) {
    
            const scenarios = Object.keys(parsedObj[geoid]);
            for (let scenario of scenarios) {
    
                const severities = constants.severities;
                for (let sev of severities) {
    
                    const parameters = constants.parameters;
                    for (let param of parameters) {
    
                        const confObj = {'p10': [], 'p50': [], 'p90': []};
                        for (let d = 0; d < dates.length; d ++) {
    
                            const simObj = parsedObj[geoid][scenario][sev][param].sims;
    
                            const arrayByDay = [];
                            for (let s = 0; s < simObj.length; s ++) {
                                arrayByDay.push(simObj[s].vals[d]);
                            }
    
                            arrayByDay.sort((a, b) => {return a - b});
                            const idx10 = Math.round(arrayByDay.length * 0.1);
                            const idx50 = Math.round(arrayByDay.length * 0.5);
                            const idx90 = Math.round(arrayByDay.length * 0.9);
    
                            confObj['p10'].push(arrayByDay[idx10]);
                            confObj['p50'].push(arrayByDay[idx50]);
                            confObj['p90'].push(arrayByDay[idx90]);
                        }
    
                        parsedObj[geoid][scenario][sev][param].conf = confObj;
                    }
                }
            }
        }
        console.log(new Date(), 'quantiles added');
    },

    transformQuantiles: function transformQuantiles(parsedObj, dates) {
        // transform parsedObj confidence bounds to D3-friendly format
        // Obj {p10: [], p50: [], p90: []} to Array(479) [{p10: 2, p50: 4, p90: 9}]

        const geoids = Object.keys(parsedObj);
        for (let geoid of geoids) {
    
            const scenarios = Object.keys(parsedObj[geoid]);
            for (let scenario of scenarios) {
    
                const severities = constants.severities;
                for (let sev of severities) {
    
                    const parameters = constants.parameters;
                    for (let param of parameters) {
    
                        const confArray = [];
                        for (let d = 0; d < dates.length; d ++) {
    
                            const confObj = {};
                            for (let interval of constants.quantiles) {
                                confObj[interval] = parsedObj[geoid][scenario][sev][param].conf[interval][d];
                            }
                            confArray.push(confObj);
                        }
                        parsedObj[geoid][scenario][sev][param].conf = confArray;
                    }
                }
            }
        }
    }
}