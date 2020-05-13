
module.exports = {
    mergeQuantiles: function mergeQuantiles(
        obj,
        geoids,
        scenarios,
        severities,
        parameters,
        quantiles,
        quantilesFile) {

        console.log('... merging quantiles')
        for (let g = 0; g < geoids.length; g ++) {

            if (geoids[g] === '06085') {

            for (let s = 0; s < scenarios.length; s ++) {

                // only USA_Lockdown1918 has conf intervals computed 
                if (scenarios[s] === 'USA_Lockdown1918') {
                    
                    for (let v = 0; v < severities.length; v ++) {

                        // only high severity has conf intervals computed 
                        if (severities[v] === 'high') {

                            for (let p = 0; p < parameters.length; p ++) {
                                
                                // only incidI has conf intervals computed 
                                if (parameters[p] === 'incidI') {
                                    
                                    const confArray = []
                                    let dates = 0;
                                    // get length of dates from first quantile entry
                                    if (quantiles.length > 0) {
                                        dates = quantilesFile[geoids[g]][scenarios[s]][severities[v]][parameters[p]][quantiles[0]].length;
                                    } else {
                                        console.log('Quantiles file is empty')
                                    }

                                    for (let d = 0; d < dates; d ++) {

                                        const confObj = {}
                                        for (let q = 0; q < quantiles.length; q ++) {

                                            confObj[quantiles[q]] = quantilesFile[geoids[g]][scenarios[s]][severities[v]][parameters[p]][quantiles[q]][d];
                                        
                                        }
                                        confArray.push(confObj);
                                    }
                                    // add confArray to overall obj
                                    obj[geoids[g]][scenarios[s]][severities[v]][parameters[p]]['conf'] = confArray;
                                }

                            }
                        }
                    }
                }
            }
        }
        }


    }   
}