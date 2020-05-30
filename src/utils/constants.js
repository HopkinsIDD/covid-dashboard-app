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

export const styles = {
    Container: {
        background: '#fefefe',
        padding: '5rem 0'
    },
    SearchBar: {
        width: '75%'
    },
    MenuIcons: {
        paddingRight: '10px'
    },
    Switch: {
        marginTop: '16px',
        paddingLeft: '12px',
    },
    UploadSwitch: {
        paddingLeft: '12px'
    }
    
};
  
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
    {'geoid': '06', 'name': 'California', 'usps': 'CA', 'path': '../store/geo06.json'},
    {'geoid': '36', 'name': 'New York', 'usps': 'NY', 'path': '../store/geo36.json'},
    {'geoid': '06037', 'name': 'Los Angeles County', 'usps': 'CA', 'path': '../store/geo06037.json'},
    {'geoid': '06075', 'name': 'San Francisco County', 'usps': 'CA', 'path': '../store/geo06075.json'},
    {'geoid': '06085', 'name': 'Santa Clara County', 'usps': 'CA', 'path': '../store/geo06085.json'},
    {'geoid': '36005', 'name': 'Bronx County', 'usps': 'NY', 'path': '../store/geo36005.json'},
    {'geoid': '36061', 'name': 'New York County', 'usps': 'NY', 'path': '../store/geo36061.json'},
    {'geoid': '36081', 'name': 'Queens County', 'usps': 'NY', 'path': '../store/geo36081.json'},
    // {'geoid': '06085', 'name': 'Santa Clara County', 'usps': 'CA', 'path': baseUrl + 'lxu213/codenames/master/src/test.json'},
];

export const COUNTYNAMES = {
    '06': 'California',
    '36': 'New York',
    '06037': 'Los Angeles County, CA',
    '06085': 'Santa Clara County, CA',
    '06075': 'San Francisco County, CA',
    '36005': 'Bronx County, NY',
    '36061': 'New York County, NY',
    '36081': 'Queens County, NY'
}
