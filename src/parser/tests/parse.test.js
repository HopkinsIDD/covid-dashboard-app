// const fs = require('fs');
const parse = require('../parse');
const utils = require('../utils');
// const constants = require('../constants');

test('return correctly parsed obj for 1 simulation file', () => {
    const filePath = 'src/parser/fixtures/Scenario_A/high_death-1.csv';
    const scenario = 'Scenario_A';
    const geoids = ['06085', '06019', '36005', '36081'];
    const dates = ['2020-05-05', '2020-05-06', '2020-05-07', '2020-05-08', '2020-05-09'];
    const severity = 'high'; 
    
    const getIdx = require('../resources/expectedIdxMap.json');
    const expected = require('../resources/expectedParseSim.json');
    
    let result = utils.initObj(geoids, [scenario], dates);
    parse.parseSim(filePath, result, geoids, scenario, severity, getIdx)
    
    expect(result).toStrictEqual(expected);
});

// test('return correctly parsed obj for scenario directories', () => {
//     // Not returning what I expect
//     const dir = 'src/parser/fixtures/';
//     const geoids = ['06085', '06019', '36005', '36081'];
//     const scenarios = ['Scenario_A', 'Scenario_C'];
//     const dates = ['2020-05-05', '2020-05-06', '2020-05-07', '2020-05-08', '2020-05-09'];
    
//     const expected = require('../resources/expectedParseDirs.json');
//     const result = parse.parseDirectories(dir, geoids, scenarios, dates)
    
//     expect(result).toStrictEqual(expected);
// });
