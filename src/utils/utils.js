import { extent } from 'd3-array';
import { timeDay } from 'd3-time';
import { timeFormat } from 'd3-time-format';
const formatDate = timeFormat('%Y-%m-%d');

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

export function shuffle(array, numDisplaySims) {
  // returns randomly shuffled array of elements based on numDisplaySims

  let currIdx = array.length;
  let tempVal = array.length;
  let randomIdx = array.length;
  const stopIndex = (array.length - numDisplaySims)

  // shuffle only indices required by numDisplaySims
  while (stopIndex !== currIdx) {
    // randomly select another element to swap with current element
    randomIdx = Math.floor(Math.random() * currIdx); 
    currIdx -= 1; 

    tempVal = array[currIdx];
    array[currIdx] = array[randomIdx]; 
    array[randomIdx] = tempVal; 
  }

  return array.slice(stopIndex, array.length);
}

export function filterR0(series, r0selected, numDisplaySims) {
  // return filtered series 
  
  // filter on current r0selected range 
  const r0min = r0selected[0], r0max = r0selected[1];
  const filtered = series.filter(s => s.r0 > r0min && s.r0 < r0max);

  // filter on numDisplaySims
  const displaySims = shuffle(filtered.map(s => s.name), numDisplaySims);
  const final = filtered.filter(s => displaySims.includes(s.name));

  return final;
}

export function createFilteredR0SeriesList(r0selected, scenarioList, severityList, stat, dataset, numDisplaySims) {
  const r0FilteredSeriesList = []
  for (let i = 0; i < scenarioList.length; i++) {
      const copy = Array.from(
          dataset[scenarioList[i].key][severityList[i].key][stat.key].sims);
      const r0FilteredSeries = filterR0(copy, r0selected, numDisplaySims);
      r0FilteredSeriesList.push(r0FilteredSeries)
  }
  return r0FilteredSeriesList
}

export function addCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function getRange(seriesPeaks) {
  // return range [min, max] of all peaks of sims given a series
  const seriesPeakExtent = extent(seriesPeaks)
  // console.log(seriesPeakExtent)
  let roundingVal;
  if (seriesPeakExtent[1].toString().length < 2) {
    roundingVal = 1
  } else if (seriesPeakExtent[1].toString().length < 3) {
    roundingVal = 10
  } else {
    roundingVal = 100
  }

  // take out rounding until display
  const minPeak = Math.ceil(seriesPeakExtent[0] / roundingVal) * roundingVal;
  const maxPeak = Math.ceil(seriesPeakExtent[1] / roundingVal) * roundingVal;

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
