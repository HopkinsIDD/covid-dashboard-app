
function calcQuantile(sortedArray, percentile) {
    let result;
    const index = percentile/100. * (sortedArray.length - 1);

    if (Math.floor(index) === index) {
        result = sortedArray[index];
    } else {
        const i = Math.floor(index);
        const fraction = index - i;
        result = sortedArray[i] + (sortedArray[i+1] - sortedArray[i]) * fraction;
    }
    return result;
};

function transformQuantiles(confObj, dates) {
    // TODO: move to constants the intervals
    const confArray = [];
    for (let d = 0; d < dates.length; d ++) {
        const obj = {};
        for (let interval of ['p10', 'p50', 'p90']) {
            obj[interval] = confObj[interval][d];
        }
        confArray.push(obj);
    }
    return confArray
}

export function addQuantiles(dataset, scenario, severity, stat, dates) {
    const confObj = {'p10': [], 'p50': [], 'p90': []};
    // TODO: dates should be brought in differently vs idxMin, idxMax
    for (let d = 0; d < dates.length; d ++) {
        const simObj = dataset[scenario][severity][stat].sims;

        const arrayByDay = [];
        for (let s = 0; s < simObj.length; s ++) {
            arrayByDay.push(simObj[s].vals[d]);
        }
        arrayByDay.sort((a, b) => {return a - b});
        confObj['p10'].push(calcQuantile(arrayByDay, 10));
        confObj['p50'].push(calcQuantile(arrayByDay, 50));
        confObj['p90'].push(calcQuantile(arrayByDay, 90));
    }
    return transformQuantiles(confObj, dates);
}