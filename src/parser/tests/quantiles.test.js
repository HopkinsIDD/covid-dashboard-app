const transform = require('../transform');

// TODO: test is failing
test('return expected quantiles', () => {
    const scenarios = ['Scenario_C'];
    const severities = ['high'];
    const parameters = ['incidI'];
    const parsedObj = require('../resources/expectedTransform.json');
    const expected = require('../resources/expectedQuantiles.json');

    transform.toD3format(parsedObj, scenarios, severities, parameters);

    expect(parsedObj).toStrictEqual(expected);
});