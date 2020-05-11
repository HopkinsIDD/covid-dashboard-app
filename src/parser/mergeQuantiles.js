
module.exports = {
    mergeQuantiles: function mergeQuantiles(obj, scenarios, severities, parameters, quantIntervals, quantiles) {

        console.log('merging quantiles')

        for (let i = 0; i < scenarios.length; i ++) {

            // only USA_Lockdown1918 has conf intervals computed 
            if (scenarios[i] === 'USA_Lockdown1918') {
                
                for (let s = 0; s < severities.length; s ++) {

                    // only high severity has conf intervals computed 
                    if (severities[s] === 'high') {

                        for (let j = 0; j < parameters.length; j ++) {
                            
                            // only incidI has conf intervals computed 
                            if (parameters[j] === 'incidI') {

                                const confArray = []
                                for (let q = 0; q < quantIntervals.length; q ++) {
                                    const intervalObj = {};
                                    intervalObj.name = quantIntervals[q];
                                    intervalObj.vals = quantiles[scenarios[i]][severities[s]][parameters[j]][quantIntervals[q]];
                                    confArray.push(intervalObj);
                                }

                                obj[scenarios[i]][severities[s]][parameters[j]]['conf'] = confArray;
                            }

                        }
                    }
                }
            }
        }

        return obj;
    }   
}