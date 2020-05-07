// id: explicit key to list items in onChange()
// key: use this to key into dataset
// name: display name for visualization

export const margin = { top: 20, right: 10, bottom: 30, left: 80 };
export const red = '#d31d30';
export const green = '#4ddaba';
export const blue = '#1f90db';
export const gray = '#9b9b9b';

export const SCENARIOS = [
    {'id': 1, 'key': 'USA_Uncontrolled', 'name': 'USA_Uncontrolled', 'checked': false, 'disabled': false},
    {'id': 2, 'key': 'USA_Lockdown1918', 'name': 'USA_Lockdown1918', 'checked': false, 'disabled': false},
    {'id': 3, 'key': 'USA_LockdownUK', 'name': 'USA_LockdownUK', 'checked': false, 'disabled': false},
];

export const STATS = [
    {'id': 1, 'key': 'incidI', 'name': 'Infections'},
    {'id': 2, 'key': 'incidH', 'name': 'Hospitalizations'},
    {'id': 3, 'key': 'incidICU', 'name': 'ICU Cases'},
    {'id': 4, 'key': 'incidVent', 'name': 'Ventilators Used'},
    {'id': 5, 'key': 'incidD', 'name': 'Deaths'},
];

export const LEVELS = [
    {'id': 1, 'key': 'high', 'name': '1% IFR, 10% hospitalization rate'}, 
    {'id': 2, 'key': 'med', 'name': '0.5% IFR, 5% hospitalization rate'},
    {'id': 3, 'key': 'low', 'name': '0.25% IFR, 2.5% hospitalization rate'},
];

// public county model files on github
const baseUrl = 'https://raw.githubusercontent.com/';
export const COUNTIES = [
    {'geoid': '06085', 'name': 'Santa Clara County', 'usps': 'CA', 'path': baseUrl + 'lxu213/codenames/master/src/test.json'},
    {'geoid': '10001', 'name': 'Lee County', 'usps': 'AL', 'path': baseUrl + 'HopkinsIDD/COVIDScenarioPipeline/master/sample_data/geoid-params.csv'},
];

export const COLORS = {
    'red': '#d31d30',
    'green': '#4ddaba',
    'blue': '#1f90db',
    'gray': '#9b9b9b'
}
