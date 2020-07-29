import { CONFINTERVALS } from './constants';

function calcQuantile(sortedArr, percentile) {
    let result;
    const index = percentile / 100. * (sortedArr.length - 1);

    if (Math.floor(index) === index) {
        result = sortedArr[index];
    } else {
        const i = Math.floor(index);
        const fraction = index - i;
        result = sortedArr[i] + (sortedArr[i + 1] - sortedArr[i]) * fraction;
    }
    return result;
};

function transformQuantiles(confObj, dates) {
    const confArray = [];
    for (let d = 0; d < dates.length; d ++) {
        const obj = {};
        for (let interval of CONFINTERVALS) {
            obj[interval] = confObj[interval][d];
        }
        confArray.push(obj);
    }
    return confArray
}

export function addQuantiles(dataset, scenario, severity, stat, dates) {
    let confObj = {}
    for (let interval of CONFINTERVALS) {
        confObj[interval] = [];
    }
    for (let d = 0; d < dates.length; d ++) {
        const simObj = dataset[scenario][severity][stat];

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