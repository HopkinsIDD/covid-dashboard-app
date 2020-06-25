import { extent } from 'd3-array';
import { timeDay } from 'd3-time';
import { timeFormat, utcParse } from 'd3-time-format';
import { addQuantiles } from '../utils/quantiles';
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

export function getDateThreshold(allTimeDates, idxMin, idxMax) {
  const filteredDates = Array.from(allTimeDates.slice(idxMin, idxMax));
  const dateThresholdIdx = Math.ceil(filteredDates.length / 2)
  const dateThreshold = filteredDates[dateThresholdIdx];
  
  return dateThreshold
}

export function getStatThreshold(scenarioList, seriesList, idxMin, idxMax) {
  // calculate smart default statThreshold and return slider range as well
  const statThresholds = [];
  let rangeDict = {'min': [], 'max': []};

  for (let i = 0; i < scenarioList.length; i++) {
    const filteredSeries = filterByDate(seriesList[i], idxMin, idxMax)

    // returns the minimum and maximum series peak
    const seriesPeaks = filteredSeries.map(sim => sim.max);
    const [seriesMin, seriesMax] = getRange(seriesPeaks);

    // adds some granularity to make statThreshold selection "smarter"
    const statThreshold = seriesMin < seriesMax / 2 ? seriesMin : seriesMax / 2;
    
    statThresholds.push(statThreshold);
    rangeDict['min'].push(seriesMin); 
    rangeDict['max'].push(seriesMax)
  }
  // select smallest min and largest max amongst all scenarios
  const sliderMin = Math.min(...rangeDict['min'])
  const sliderMax = Math.max(...rangeDict['max'])

  // statThreshold defaults to the statThreshold of the first scenario
  return [statThresholds[0], sliderMin, sliderMax]; 
}

export function flagSimsOverThreshold(scenarioList, seriesList, allTimeDates, 
  idxMin, idxMax, statThreshold, dateThreshold) {
  // return series with sims flagged above or below thresholds
  const filteredSeriesList = [];
  const simsOverList = [];

  for (let i = 0; i < scenarioList.length; i++) {
    // mutate seriesList to flag which sims are above/below thresholds
    const simsOver = flagSims(seriesList[i], statThreshold, allTimeDates, dateThreshold);
    // filter mutated seriesList by dates
    const filteredSeries = filterByDate(seriesList[i], idxMin, idxMax)

    filteredSeriesList.push(filteredSeries)
    simsOverList.push(simsOver)
  }
  return [filteredSeriesList, simsOverList]
}

export function flagSims(series, statThreshold, dates, dateThreshold) {
  // MUTATION: flags which sims in a series are above stat and date threshold 
  const dateIndex = dates.findIndex(
    date => formatDate(date) === formatDate(dateThreshold));

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

export function getExceedences(scenarioList, seriesList, simsOverList) {
  const percExceedenceList = []

  for (let i = 0; i < scenarioList.length; i++) {
    const percExceedence = seriesList[i].length > 0 ?
      simsOverList[i] / seriesList[i].length : 0;
    percExceedenceList.push(percExceedence)
  }
  return percExceedenceList
}

export function filterByDate(series, idxMin, idxMax) {
  const filteredSeries = series.map( s => {
      const newS = {...s}
      newS.vals = s.vals.slice(idxMin, idxMax)
      return newS
  });
  return filteredSeries
}

export function getConfBounds(dataset, scenarioList, severityList, stat, dates, idxMin, idxMax) {
  // TODO: do we need both dates and idx Min/Max?
  // TODO: once this is working, can we filter first to reduce quantile calcs required?
  const confBoundsList = [];
  for (let i = 0; i < scenarioList.length; i++) {
    // TODO: why is this line working
    // const confBounds = dataset[scenarioList[i].key][severityList[i].key][stat.key].conf; //.slice(idxMin, idxMax);
    // TODO: and this line not, even though confBounds appear to be the same
    const confBounds = addQuantiles(
      dataset, scenarioList[i].key, severityList[i].key, stat.key, dates)
    const filteredConfBounds = confBounds.slice(idxMin, idxMax);

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

export function getR0range(dataset, scenario, severity, stat) {
  const r0array = dataset[scenario.key][severity.key][stat.key]
    .sims.map(sim => sim.r0);
  const r0full = [Math.min(...r0array), Math.max(...r0array)];
  return r0full
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

export function filterR0(
  r0selected, scenarioList, severityList, stat, dataset, numDisplaySims) {
  // return series filtered on R0 range and numDisplaySims
  const r0FilteredSeriesList = []

  for (let i = 0; i < scenarioList.length; i++) {
    const series = Array.from(
        dataset[scenarioList[i].key][severityList[i].key][stat.key].sims);

    const r0min = r0selected[0], r0max = r0selected[1];
    const filtered = series.filter(s => s.r0 > r0min && s.r0 < r0max);

    // filter on numDisplaySims
    const displaySims = shuffle(filtered.map(s => s.name), numDisplaySims); 
    const r0FilteredSeries = filtered.filter(s => displaySims.includes(s.name));

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
