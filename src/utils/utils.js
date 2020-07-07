import { timeDay } from 'd3-time';
import { timeFormat, utcParse } from 'd3-time-format';
import { addQuantiles } from '../utils/quantiles';

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

export function buildScenarioMap(dataset) {
  // Instantiates mapping of scenario to list of severities

  let obj = {}; 
  Object.keys(dataset).forEach(scenario => {
    let keys = Object.keys(dataset[scenario]); 
    keys = keys.filter(key => key !== "dates"); 
    obj[scenario] = keys; 
  })
  return obj;
}

export function getConfBounds(dataset, scenarioList, severityList, stat, dates, idxMin, idxMax) {
  const confBoundsList = [];
  for (let i = 0; i < scenarioList.length; i++) {
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

function shuffle(array, numDisplaySims) {
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
  const seriesListForBrush = []

  for (let i = 0; i < scenarioList.length; i++) {
    const series = Array.from(
        dataset[scenarioList[i].key][severityList[i].key][stat.key].sims);

    const r0min = r0selected[0], r0max = r0selected[1];
    const filtered = series.filter(s => s.r0 > r0min && s.r0 < r0max);

    // filter on numDisplaySims
    const displaySims = shuffle(filtered.map(s => s.name), numDisplaySims); 
    const seriesForBrush = filtered.filter(s => displaySims.includes(s.name));

    seriesListForBrush.push(seriesForBrush)
  }
  return seriesListForBrush
}

export function addCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function getDateIdx(firstDate, currentDate) {
  return timeDay.count(firstDate, currentDate);
};

export function capitalize(s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const getReadableDate = timeFormat('%b %d, %Y');
