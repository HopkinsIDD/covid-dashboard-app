import { extent, max } from 'd3-array'
///////////////// UTILS ///////////////////
export function addCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function getRange(series) {
  // return range [min, max] of all sims given a series
  const seriesMaxPeaks = series.map( sim => {
    return max(sim.vals)
  });
  const seriesPeakExtent = extent(seriesMaxPeaks)

  // take out rounding until display
  const minPeak = Math.ceil(seriesPeakExtent[0] / 100) * 100;
  const maxPeak = Math.ceil(seriesPeakExtent[1] / 100) * 100;

  return [minPeak, maxPeak];
};

// export function readableDate(date) {
//   // takes date Obj returns Month Day, Year

//   const dateArray = date.toDateString().split(' ').slice(1);
//   const day = dateArray[1];
//   const newDay = day[0] === '0' ? day.slice(1) : day;
  
//   return dateArray[0] + ' ' + newDay + ', ' + dateArray[2];
// }


    // export function calcSimsOver(series) {
    //     let simsOver = 0;
    //     Object.values(series).map(sim => {
    //       if (sim.over === true) {
    //           simsOver = simsOver + 1;
    //       } ;
    //     });
    //     return simsOver;
    // };
