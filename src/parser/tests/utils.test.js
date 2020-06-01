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

    const obj = utils.initObj(geoids, scenarios, dates);
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
    const scenarios = ['Scenario_C'];
    const severities = ['high'];
    const parameters = ['incidI'];
    const dates = ['2020-05-05', '2020-05-06', '2020-05-07', '2020-05-08', '2020-05-09'];

    const parsedObj = {
        '06085': {
            'Scenario_C': {
                'dates': dates,
                'high': {
                    'incidI': {
                        'peak': 0,
                        'sims': {
                            '1': [ 0, 1, 2, 5, 1 ], 
                            '10': [1, 3, 5, 9, 3 ]
                        },
                        'conf': {}
                    }
                }
            }
        },
        '06019': {
            'Scenario_C': {
                'dates': dates,
                'high': {
                    'incidI': {
                        'peak': 0,
                        'sims': {
                            '1': [ 2, 2, 3, 7, 8 ], 
                            '10': [5, 8, 9, 9, 2 ]
                        },
                        'conf': {}
                    }
                }
            }
        }
    };



    utils.aggregateByState(parsedObj, scenarios, severities, parameters, dates);

    const expected = {
    '06': {
        'Scenario_C': {
            'dates': dates,
            'high': {
                'incidI': {
                    'peak': 0,
                    'sims': {
                        '1': [ 2, 3, 5, 12, 9 ], 
                        '10': [ 6, 11, 14, 18, 5 ]
                    },
                    'conf': {}
                }
            }
        }
    },
    '06085': {
        'Scenario_C': {
            'dates': dates,
            'high': {
                'incidI': {
                    'peak': 0,
                    'sims': {
                        '1': [ 0, 1, 2, 5, 1 ], 
                        '10': [1, 3, 5, 9, 3 ]
                    },
                    'conf': {}
                }
            }
        }
    },
    '06019': {
        'Scenario_C': {
            'dates': dates,
            'high': {
                'incidI': {
                    'peak': 0,
                    'sims': {
                        '1': [ 2, 2, 3, 7, 8 ], 
                        '10': [5, 8, 9, 9, 2 ]
                    },
                    'conf': {}
                }
            }
        }
    }
};
    expect(parsedObj).toStrictEqual(expected);
});
