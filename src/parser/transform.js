const constants = require('./constants');

module.exports = {

    toD3format: function toD3format(result, scenarios) {
        // transform via mutation each simObj to D3-friendly format
        const severities = constants.severities;
        const parameters = constants.parameters;
        const geoids = Object.keys(result);
        
        for (let g = 0; g < geoids.length; g ++) {

            for (let s = 0; s < scenarios.length; s ++) {
    
                for (let v = 0; v < constants.severities.length; v ++) {
        
                    for (let p = 0; p < constants.parameters.length; p ++) {

                        const objToTransform = result[geoids[g]][scenarios[s]][severities[v]][parameters[p]]['sims'];
                        const d3obj = this.transformD3(objToTransform);
                        result[geoids[g]][scenarios[s]][severities[v]][parameters[p]]['sims'] = d3obj;
                    
                    }    
                }
            }
        }
    },

    transformD3: function transformD3(obj) {
    // transforms simulation Object to d3-friendly Array of Objects
        const d3array = [];
        const simNums = Object.keys(obj);
        
        for (let n = 0; n < simNums.length; n ++) {
            const simObj = {};
            const sim = simNums[n];

            simObj.name = parseInt(sim);
            simObj.vals = obj[sim];
            simObj.over = false;
            simObj.max = Math.max.apply(null, simObj.vals);
            
            // TODO: generate r0 randomly but eventually join on sim number
            simObj.r0 = parseFloat((Math.random() * 4).toFixed(2));

            d3array.push(simObj)
        }
        return d3array;
    }
}

