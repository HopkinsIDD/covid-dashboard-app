const utils = require('../utils');
const constants = require('../constants');

test('returns expected dates array', () => {
    const dir = 'src/parser/fixtures/';
    const scenarios = ['Scenario_A'];

    const expected = [
        '2020-05-05', '2020-05-06', '2020-05-07', '2020-05-08', '2020-05-09'
    ];
    expect(utils.getDates(dir, scenarios)).toStrictEqual(expected);
});

test('returns expected initialized object', () => {
    const geoids = ['06085', '06019', '36005', '36081'];
    const scenarios = ['Scenario_A', 'Scenario_C'];
    const dates = ['2020-05-05', '2020-05-06', '2020-05-07', '2020-05-08', '2020-05-09'];

    const obj = utils.initObj(
        geoids,
        scenarios,
        constants.severities,
        constants.parameters,
        dates
        );
    const expected = require('../resources/expectedInitObj.json');

    expect(obj).toStrictEqual(expected);
})

test('return expected index mapping', () => {
    const headers = [
        'time', 'uid', 'geoid', 'sim_num', 'comp', 'incidI', 'hosp_curr', 
        'icu_curr', 'vent_curr', 'incidH', 'incidICU', 'incidVent', 
        'incidD', 'date_inds', 'geo_ind'];

    const obj = utils.getIdx(headers, constants.parameters);
    const expected = require('../resources/expectedIdxMap.json');

    expect(obj).toStrictEqual(expected);
});

test('return expected aggregation by state', () => {
    const geoids = ['06085', '06019'];
    const states = ['06'];
    const scenarios = ['Scenario_C'];
    const severities = ['high'];
    const parameters = ['incidI'];
    const dates = ['2020-05-05', '2020-05-06', '2020-05-07', '2020-05-08', '2020-05-09'];
    
    const parsedObj = require('../resources/inputStateAgg.json');
    const finalObj = require('../resources/finalObjStateAgg.json');
    const expected = require('../resources/expectedAggByState.json');

    utils.aggregateByState(
        parsedObj, 
        finalObj,
        states,
        geoids,
        scenarios, 
        severities,
        parameters,
        dates
        );

    expect(parsedObj).toStrictEqual(expected);
});

test('return expected r0', () => {
    const dir = '../resources';
    const scenario = 'Inference';
    const severity = 'high';
    const sim = 1;

    const R0 = utils.returnR0(dir, scenario, severity, sim);
    
    expect(R0).toStrictEqual(2.24);
});
