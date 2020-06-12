const actual = require('../actual');

test('return correctly reads actual csv', () => {

    const path = 'src/parser/resources/actualsDeath.csv';
    const geoids = ['06085', '06019', '36005', '36081'];
    const params = ['deaths'];
    const expected = require('../resources/expectedActual.json');
  
    const obj = {
        'deaths': {
            '06085': [],
            '06019': [],
            '36005': [],
            '36081': [],
        }
    };

    actual.readActual(path, obj, geoids, params)
    
    expect(obj).toStrictEqual(expected);
});

test('return correctly aggregates state-level actual data', () => {

    const obj = require('../resources/expectedActual.json');
    const states = ['06', '36'];
    const geoids = ['06085', '06019', '36005', '36081'];
    const params = ['deaths'];
    const expected = require('../resources/expectedAggActual.json');

    actual.aggregateActualByState(obj, states, geoids, params)
    
    expect(obj).toStrictEqual(expected);
});