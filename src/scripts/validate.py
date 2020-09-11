import os
import json
import click
from datetime import datetime


def validate_scenario(scenario: str):
    ''' 
    Validate scenario name does not contain illegal chars and has formatted run date
    e.g. '20200718-inference', '2020-07-18-inference', '2020-07-19-21-44-47-inference'
    '''
    illegal_chars = ['.', ',', ';', ':']
    if any(char in scenario for char in illegal_chars):
        raise Exception("Scenario name {} contains at least one illegal character from {}."
            .format(scenario, illegal_chars))

    # use scenario as run_date if scenario is not hyphenated
    run_date = '-'.join(scenario.split('-')[:-1]) if '-' in scenario else scenario

    try:
        format1, format2 = '%Y%m%d', '%Y%m%d%H%M%S'
        datetime.strptime(run_date, format1) or datetime.strptime(run_date, format2)
    except:
        raise Exception("Unexpected run date format. Does not match {} or {}"
            .format(format1, format2))


def check_dates_in_death_rates(scenario: str, death_rates: list):
    ''' Validate dates key is included in data '''
    if 'dates' not in death_rates:
        raise Exception("Dates is missing from scenario {}".format(scenario))


def validate_rate(scenario: str, rate: str):
    ''' Validate given death rate is one of the expected death rates '''
    expected_death_rates = ['low', 'med', 'high']
    if rate not in expected_death_rates:
        raise Exception("Scenario {}'s death rate {} is not an expected death rate"
            .format(scenario, rate))


def validate_indicators(scenario: str, rate: str, indicators: list, outcomes: dict):
    ''' Validate given indicator is one of the expected indicators '''
    expected_indicators = [value['key'] for value in outcomes.values()]

    if set(indicators) != set(expected_indicators):
        raise Exception("{}, {} includes an unexpected indicator. Expected are {}."
            .format(scenario, rate, expected_indicators))


def validate_sim_keys(scenario: str, rate: str, indicator: str, sim_obj: dict, expected_days: int):
    ''' Validate simulation object contains expected keys and length of values'''
    expected_keys = ['max', 'name', 'over', 'r0', 'vals'] 
    for i in range(len(sim_obj)):
        if sorted(list(sim_obj[i].keys())) != expected_keys:
            raise Exception("{}, {}, {}, object {} is missing one of the following keys: {}"
                .format(scenario, rate, indicator, i, expected_keys))

        days = len(sim_obj[i]['vals'])
        if days != expected_days:
            raise Exception("{}, {}, {}, object {} length of values {} is not equal to the length of dates {}"
                .format(scenario, rate, indicator, i, days, expected_days))


def validate_geoid(obj: dict, outcomes: dict):
    ''' Validate one county geoid dict object '''
    scenarios = list(obj.keys())
    for scenario in scenarios:

        death_rates = list(obj[scenario].keys())
        expected_days = len(obj[scenario]['dates'])

        validate_scenario(scenario)
        check_dates_in_death_rates(scenario, death_rates)
        death_rates.remove('dates')

        for rate in death_rates:
            indicators = list(obj[scenario][rate].keys())

            validate_rate(scenario, rate)
            validate_indicators(scenario, rate, indicators, outcomes)

            for indicator in indicators:
                sim_obj = obj[scenario][rate][indicator]
                validate_sim_keys(scenario, rate, indicator, sim_obj, expected_days)


def validate_map_stats(stats: dict, expected_states: list, expected_counties: list, outcomes: dict) -> set:
    ''' 
    Validate statsForMap includes all expected states, counties, and outcomes
    Returns scenario names to compare against scenario names in geoid files
    '''
    states = sorted(list(stats.keys()))
    expected_indicators = set(value['key'] for value in outcomes.values())
    scenario_names = []
    
    for state in expected_states: 
        if state not in states:
            raise Exception("statsForMap.json is missing state {}".format(state))

        exp_counties = [x for x in expected_counties if x.startswith(state)]
        counties = sorted(list(stats[state].keys()))

        for county in exp_counties:
            if county not in counties:
                # error, not exception, since web app can handle missing counties in statsForMap
                print("ERROR: statsForMap state {} is missing county {}".format(state, county))
            else:
                scenarios = sorted(list(stats[state][county].keys()))
                scenario_names = scenarios if not scenario_names else scenario_names
                indicators = set(stats[state][county][scenarios[0]].keys()) if scenarios else None

                if indicators != expected_indicators:
                    raise Exception("statsForMap {}, {} is missing an expected indicator from {}"
                        .format(state, county, expected_indicators))
    
    return set(scenario_names)


def validate_scenario_names(geoid_scenarios: set, map_scenarios: set):
    ''' Validate scenario names of geoid file match scenario names of statsForMap '''
    if geoid_scenarios != map_scenarios:
        raise Exception("County-level geoid scenarios {} do not match statsForMap scenarios {}"
            .format(geoid_scenarios, map_scenarios))


def validate_boundaries(boundaries: dict, expected_states: list, expected_counties: list):
    ''' Validate countyBoundaries contain expected counties and states '''

    states = sorted(list(boundaries.keys()))
    for state in expected_states:
        if state not in states:
            raise Exception("County boundaries is missing state {}".format(state))
        county_num = len(boundaries[state]['features'])
        exp_counties = [x for x in expected_counties if x.startswith(state)]

        for i in range(county_num):
            county = boundaries[state]['features'][i]['properties']['geoid']
            if county in exp_counties:
                exp_counties.remove(county)
        if exp_counties:
            print("ERROR: countyBoundaries state {} is missing counties {}"
                .format(state, exp_counties))


def validate_actuals(actuals: list, expected_states: list, expected_counties: list):
    ''' Validate expected number of county-level and state-level actuals files exists '''
    counties = [x for x in actuals if len(x) == 5]
    states = [x for x in actuals if len(x) == 2]

    if len(states) < len(expected_states):
        raise Exception("Expecting at least {} state-level actual.json files, not {}"
            .format(len(expected_states), len(states)))

    if len(counties) < len(expected_counties):
        raise Exception("Expecting at least {} county-level actual.json files, not {}"
            .format(len(expected_counties), len(counties)))


def validate_reported_indicators(actual_obj: dict):
    ''' 
    Validate actual file includes expected reported indicators 
    Confirm date format and value type are '%Y-%m%d' and int, respectively
    '''
    reported_indicators = {'incidC', 'incidD'}
    if set(actual_obj.keys()) != reported_indicators:
        raise Exception("Actual.json indicators {} do not match expected actual indicators {}"
            .format(set(actual_obj.keys()), reported_indicators))

    expected_format = '%Y-%m-%d'
    for indicator in reported_indicators:
        days = len(actual_obj[indicator])
        for i in range(days):
            date = actual_obj[indicator][i]['date']
            value = actual_obj[indicator][i]['value']
            try:
                datetime.strptime(date, '%Y-%m-%d')
            except:
                raise Exception("Actual.json date format {} does not match expected format {}"
                    .format(date, expected_format))
            if not isinstance(value, int):
                raise Exception("Actual.json value {} should be type int"
                    .format(value))

def validate_dir(fdir: str):
    # TODO what if these files don't exist? raise Exception
    with open(fdir + 'outcomes.json') as o, open(fdir + 'counties.json') as c, \
        open(fdir + 'states.json') as s, open(fdir + 'statsForMap.json') as m, \
        open(fdir + 'countyBoundaries.json') as b:
        outcomes = json.load(o)
        expected_counties = sorted(list(json.load(c).keys()))
        expected_states = sorted(list(json.load(s).keys()))
        stats_for_map, boundaries = json.load(m), json.load(b)

        ### STATS FOR MAP ###
        map_scenarios = validate_map_stats(stats_for_map, expected_states, expected_counties, outcomes)
        validate_boundaries(boundaries, expected_states, expected_counties)

        ### COUNTY-LEVEL GEOID ###
        counties = [f.strip('.json') for f in os.listdir(fdir) if not f.startswith('.')]
        for i, county in enumerate(expected_counties):
            if i%100==0: print(i, county)
            if county not in counties:
                raise Exception("{} is missing county file {}.json".format(fdir, county))

            with open('{}/{}.json'.format(fdir, county)) as f:
                obj = json.load(f)
                validate_geoid(obj, outcomes)

                if county == '01001':
                    validate_scenario_names(set(obj.keys()), map_scenarios)

        ### STATE-LEVEL GEOID ###
        states = [f.strip('.json') for f in os.listdir(fdir) if not f.startswith('.')]
        for state in expected_states:
            if state not in states:
                raise Exception("{} is missing state file {}.json".format(fdir, state))

            with open('{}/{}.json'.format(fdir, county)) as f:
                obj = json.load(f)
                validate_geoid(obj, outcomes)

        ### ACTUALS ###
        suffix = '_actuals.json'
        actuals = [f.strip(suffix) for f in os.listdir(fdir) if not f.startswith('.') and f.endswith(suffix)]
        validate_actuals(actuals, expected_states, expected_counties)

        # just checking one file for reported indicators
        with open(fdir + '01001' + suffix) as a:
            obj = json.load(a)
            validate_reported_indicators(obj)

@click.command()
@click.option("-p", "--path", "path", type=click.Path(exists=True), default='json_output/',
              help="Enter absolute or relative path of directory or individual file to validate, \
              e.g. 'json_output/' for entire directory or 'json_output/06085.json' for an individual file \
              Individual file validator only supports state-level or county-level geoid jsons.")
def validate(path: str):

    # strip base directory out of path
    file_dir = '/'.join(path.split('/')[:-1]) + '/'

    if os.path.isdir(path):
        validate_dir(path)

        print('--***-- VALIDATION COMPLETE: {} --***--'.format(path))

    elif os.path.isfile(path):

        with open(path) as f, open(file_dir + 'outcomes.json') as o:
            obj, outcomes = json.load(f), json.load(o)
            validate_geoid(obj, outcomes)

        print('--***-- VALIDATION COMPLETE: {} --***--'.format(path))

    else:
        print('Cannot read {} for validation'.format(path))


if __name__ == "__main__":

    validate()
