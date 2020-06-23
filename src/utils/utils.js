import { max, extent } from 'd3-array';
import { timeDay } from 'd3-time';
import { timeFormat, utcParse } from 'd3-time-format';

const formatDate = timeFormat('%Y-%m-%d');
const parseDate = utcParse('%Y-%m-%d');

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

export function configureThresholds(scenarioList, seriesList, allTimeDates, dateRange) {
  // calculate smart default statThreshold, dateThreshold
  // and return series with sims above thresholds and perc exceedences

  const filteredSeriesList = []
  const percExceedenceList = []

  const idxMin = timeDay.count(allTimeDates[0], dateRange[0]);
  const idxMax = timeDay.count(allTimeDates[0], dateRange[1]);

  const filteredDates = Array.from(allTimeDates.slice(idxMin, idxMax));
  const dateThresholdIdx = Math.ceil(filteredDates.length / 2)
  const dateThreshold = filteredDates[dateThresholdIdx];
  let statThreshold = 0;
  let smartStatThresh = 0;
  let sMin = Number.POSITIVE_INFINITY;
  let sMax = 0;
  let sliderMin = Number.POSITIVE_INFINITY;
  let sliderMax = 0;

  for (let i = 0; i < scenarioList.length; i++) {

      [smartStatThresh, sliderMin, sliderMax] = calcSmartThresholds(
          seriesList[i], i, statThreshold, idxMin, idxMax, sMin, sMax)

      const simsOver = returnSimsOverThreshold(
          seriesList[i], smartStatThresh, allTimeDates, dateThreshold);

      // series has been mutated with above/below threshold are now added
      const filteredSeries = filterByDate(seriesList[i], idxMin, idxMax)
      filteredSeriesList.push(filteredSeries)

      // calculate percExceedence based on series after filtering down
      const percExceedence = filteredSeries.length > 0 ?
          simsOver / filteredSeries.length : 0;
      percExceedenceList.push(percExceedence)
  }
  return [filteredSeriesList, percExceedenceList, smartStatThresh, 
          dateThreshold, sliderMin, sliderMax]
}

export function calcSmartThresholds(series, i, statThreshold, idxMin, idxMax, sliderMin, sliderMax) {
  // calculates and returns default smart stat threshold
  const filteredSeriesStat = filterByDate(series, idxMin, idxMax)

  // array of all peaks in filtered series
  const seriesPeaks = filteredSeriesStat.map(sim => max(sim.vals));
  const [seriesMin, seriesMax] = getRange(seriesPeaks);

  // ensures side by side y-scale reflect both series
  if (seriesMin < sliderMin) sliderMin = seriesMin
  if (seriesMax > sliderMax) sliderMax = seriesMax

  // adds a range of "smart" value for statThreshold 
  if (i === 0 && seriesMin < seriesMax / 2) statThreshold = seriesMin; 
  if (i === 0 && seriesMin >= seriesMax / 2) statThreshold = seriesMax / 2; 

  return [statThreshold, sliderMin, sliderMax];
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

export function filterByDate(series, idxMin, idxMax) {
  const filteredSeries = series.map( s => {
      const newS = {...s}
      newS.vals = s.vals.slice(idxMin, idxMax)
      return newS
  });
  return filteredSeries
}

export function getConfBounds(dataset, scenarioList, severityList, stat, idxMin, idxMax) {
  const confBoundsList = [];
  for (let i = 0; i < scenarioList.length; i++) {
      const confBounds = dataset[scenarioList[i].key][severityList[i].key][stat.key].conf;
      const filteredConfBounds = confBounds.slice(idxMin, idxMax)
      confBoundsList.push(filteredConfBounds);
  }
  return confBoundsList
}

export function getActuals(geoid, stat, scenarioList) {
  const actualList = [];
  // instantiate actuals data if data for specific indicator exists
  for (let i = 0; i < scenarioList.length; i++) {
    let actual = [];
    const indicator = stat.name.toLowerCase();
    const actualJSON = require('../store/actuals.json');
    if (Object.keys(actualJSON).includes(indicator)) {
        actual = actualJSON[indicator][geoid].map( d => {
            return { date: parseDate(d.date), val: d.val}
        });
    }
    actualList.push(actual);
  }
  return actualList
}

export function shuffle(array, numDisplaySims) {
  // returns randomly shuffled array of elements based on numDisplaySims

  let currIdx = array.length;
  let tempVal = array.length;
  let randomIdx = array.length;
  // if array is less than desired num of sims to display, shuffle whole array
  const stopIdx = numDisplaySims > array.length ? 0 : (array.length - numDisplaySims);

  // shuffle only indices required by numDisplaySims
  while (stopIdx !== currIdx) {
    // randomly select another element to swap with current element
    randomIdx = Math.floor(Math.random() * currIdx); 
    currIdx -= 1; 

    tempVal = array[currIdx];
    array[currIdx] = array[randomIdx]; 
    array[randomIdx] = tempVal; 
  }
  return array.slice(stopIdx, array.length);
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

export function filterR0seriesList(
  r0selected, scenarioList, severityList, stat, dataset, numDisplaySims) {
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
