const utils = require('./utils');

module.exports = {

    toD3format: function toD3format(dir, result, scenarios, severities, parameters) {
        // transform via mutation each simObj to D3-friendly format
        const geoids = Object.keys(result);
        
        for (let geoid of geoids) {

            for (let scenario of scenarios) {
    
                for (let sev of severities) {
        
                    for (let param of parameters) {

                        const objToTransform = result[geoid][scenario][sev][param]['sims'];
                        const d3obj = this.transformD3(
                            dir, 
                            objToTransform,
                            scenario, 
                            sev
                        );

                        result[geoid][scenario][sev][param]['sims'] = d3obj;
                    }    
                }
            }
        }
    },

    transformD3: function transformD3(dir, obj, scenario, severity) {
        // transforms simulation Object to d3-friendly Array of Objects
        const d3array = [];
        const simNums = Object.keys(obj);
        
        for (let sim of simNums) {
            const simObj = {};

            simObj.name = parseInt(sim);
            simObj.vals = obj[sim];
            simObj.over = false;
            simObj.max = Math.max.apply(null, simObj.vals);
            simObj.r0 = utils.returnR0(dir, scenario, severity, sim);

            d3array.push(simObj)
        }
        return d3array;
    }
}

