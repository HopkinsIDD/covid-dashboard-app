// id: explicit key to list items in onChange()
// key: use this to key into dataset
// name: display name for visualization

export const margin = { yAxis: 80, top: 10, right: 10, bottom: 30, left: 10, chartTop: 15 };
export const red = '#d31d30';
export const green = '#4ddaba';
export const blue = '#1f90db';
export const gray = '#9b9b9b';
export const lightgray = '#d0d0d0';
export const graphBkgd = '#fcfcfc';
export const chartBkgd = '#f0f2f5';
export const scenarioColors = ['#4ddaba', '#b6f5e7','#19b18e', '#e0fdf7', '#008769', '#acdacf']
export const mapLowColors = ['#deebf7', '#e5f5e0', '#fee6ce', '#fee0d2'] 
export const mapHighColors = ['#3885fa', '#008769', '#e6550d', '#de2d26']

export const STATS = [
    {'id': 1, 'key': 'incidI', 'name': 'Infections'},
    {'id': 2, 'key': 'incidH', 'name': 'Hospitalizations'},
    {'id': 3, 'key': 'incidICU', 'name': 'ICU Cases'},
    {'id': 4, 'key': 'incidVent', 'name': 'Ventilators Used'},
    {'id': 5, 'key': 'incidD', 'name': 'Deaths'},
];

export const LEVELS = [
    {'id': 1, 'key': 'high', 'name': '1% IFR'}, 
    {'id': 2, 'key': 'med', 'name': '0.5% IFR'},
    {'id': 3, 'key': 'low', 'name': '0.25% IFR'},
];

// public county model files on github
// const baseUrl = 'https://raw.githubusercontent.com/';
export const COUNTIES = [
    {'geoid': '06085', 'name': 'Dorne County', 'usps': 'ES', 'state': '01', 'path': '../store/geo06085.json'},
    {'geoid': '01081', 'name': 'Highgarden County', 'usps': 'TW',  'state': '01','path': '../store/geo01081.json'},
    {'geoid': '25017', 'name': 'Winterfell County', 'usps': 'NR',  'state': '02','path': '../store/geo25017.json'},
    {'geoid': '36061', 'name': 'Kings Landing County', 'usps': 'TC',  'state': '03','path': '../store/geo36061.json'},
    // {'geoid': '06085', 'name': 'Dorne', 'usps': 'CA', 'path': baseUrl + 'lxu213/codenames/master/src/test.json'},
];

export const COUNTYNAMES = {
    '06085': 'Dorne County, ES',
    '01081': 'Highgarden County, TW',
    '25017': 'Winterfell County, NR',
    '36061': 'Kings Landing County, TC'
}
