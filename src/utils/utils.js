import { extent } from 'd3-array';
import { timeDay } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import { numDisplaySims } from './constants';
const formatDate = timeFormat('%Y-%m-%d');


///////////////// UTILS ///////////////////


export function buildScenarios(dataset) {
  // Instantiates constant scenarios used for a given geoid

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

export function filterR0(dataset, scenarios, stat, severityList, r0selected) {
  // Return series List after filtering sims down based on selected R0

  const seriesList = []

  for (let i = 0; i < scenarios.length; i++) {
      const copy = Array.from(
          dataset[scenarios[i].key][severityList[i].key][stat.key].sims);

      // filter down sims on r0
      const r0min = r0selected[0], r0max = r0selected[1];
      const series = copy.filter(s => { 
          return (s.r0 > r0min && s.r0 < r0max)}).slice(0, numDisplaySims);

      // console.log('r0 series', series.map(sim => {return `${sim.name}: ${sim.r0}`}))

      seriesList.push(series)
  }
  return seriesList
}

export function returnSimsOverThreshold(series, statThreshold, dates, dateThreshold) {
  // Marks which simulations in a series are above threshold given stat and date

  const dateIndex = dates.findIndex(
      date => formatDate(date) === formatDate(dateThreshold)
      );
  let simsOver = 0;
  Object.values(series).forEach((sim) => {
      let simOver = false;
      for (let i = 0; i < dateIndex; i++) {
          if (sim.vals[i] > statThreshold){
              simsOver = simsOver + 1;
              simOver = true;
              break;
          }
      }
      simOver ? sim.over = true : sim.over = false
  })
  return simsOver;
}

export function addCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function getRange(seriesPeaks) {
  // return range [min, max] of all peaks of sims given a series
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

export const getReadableDate = timeFormat('%b %d, %Y');
