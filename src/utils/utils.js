import { extent } from 'd3-array';
import { timeDay } from 'd3-time';
///////////////// UTILS ///////////////////

export function buildScenarios(dataset) {
  const keys = Object.keys(dataset); 
  const scenarioArray = []; 
  for (let i = 0; i < keys.length; i++) {
    const obj = {}; 
    obj.id = i;
    obj.key = keys[i];
    obj.name = keys[i];
    obj.checked = false;
    obj.disabled = false;

    scenarioArray.push(obj);
  }
  return scenarioArray;
}

export function addCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function getRange(series, seriesPeaks) {
  // return range [min, max] of all sims given a series
  // const seriesMaxPeaks = series.map( sim => {
  //   return max(sim.vals)
  // });
  const seriesPeakExtent = extent(seriesPeaks)

  // take out rounding until display
  const minPeak = Math.ceil(seriesPeakExtent[0] / 100) * 100;
  const maxPeak = Math.ceil(seriesPeakExtent[1] / 100) * 100;

  return [minPeak, maxPeak];
};

export function getDateIdx(firstDate, currentDate) {
  return timeDay.count(firstDate, currentDate);
};

export function capitalize(s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

