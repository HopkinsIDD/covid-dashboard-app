///////////////// UTILS ///////////////////
export function addCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function getRange(series) {
  // return range [min, max] of all sims given a series
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  series.forEach(sim => {
      const simPeak = Math.max.apply(null, sim.vals);
      max = simPeak > max ? simPeak : max;
      min = simPeak < min ? simPeak : min;
  });
  
  min = Math.ceil(min / 100) * 100;
  max = Math.ceil(max / 100) * 100;

  return [min, max];
};

export function updateThresholdFlag(series, statThreshold) {
  // update 'over' flag to true if sim peak surpasses statThreshold
  // returns numSims 'over' threshold
  let simsOver = 0;
  
  Object.values(series).map(sim => {
    const simPeak = Math.max.apply(null, sim.vals);
    if (simPeak > statThreshold) {
        simsOver = simsOver + 1;
        return sim.over = true;
    } else {
        return sim.over = false;
    };
  })
  return simsOver;
};
