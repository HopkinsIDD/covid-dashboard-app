import { extent } from 'd3-array';
import { timeFormat } from 'd3-time-format';

const formatDate = timeFormat('%Y-%m-%d');

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
      console.log(filteredSeries)
  
      // returns the minimum and maximum series peak
      const seriesPeaks = filteredSeries.map(sim => sim.max);
      console.log(seriesPeaks)
      const [seriesMin, seriesMax] = getRange(seriesPeaks);
      console.log(seriesMin, seriesMax)
  
      // adds some granularity to make statThreshold selection "smarter"
      const statThreshold = seriesMin > seriesMax / 2 ? seriesMin : seriesMax / 2;
      console.log(statThreshold)
      
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
    const minPeak = Math.ceil(seriesPeakExtent[0] / roundingVal) * roundingVal;
    const maxPeak = Math.ceil(seriesPeakExtent[1] / roundingVal) * roundingVal;
  
    return [minPeak, maxPeak];
  };