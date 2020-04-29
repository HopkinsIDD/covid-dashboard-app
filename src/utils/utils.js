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

export function readableDate(date) {
  // takes date Obj returns Month Day, Year

  const dateArray = date.toDateString().split(' ').slice(1);
  const day = dateArray[1];
  const newDay = day[0] === '0' ? day.slice(1) : day;
  
  return dateArray[0] + ' ' + newDay + ', ' + dateArray[2];
}


    // export function calcSimsOver(series) {
    //     let simsOver = 0;
    //     Object.values(series).map(sim => {
    //       if (sim.over === true) {
    //           simsOver = simsOver + 1;
    //       } ;
    //     });
    //     return simsOver;
    // };
