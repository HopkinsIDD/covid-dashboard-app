// id: explicit key to list items in onChange()
// key: use this to key into dataset
// name: display name for visualization

// how many sim curves should be displayed in Graph
export const numDisplaySims = 30;  
export const margin = { yAxis: 80, top: 10, right: 10, bottom: 30, left: 10, chartTop: 15 };
export const red = '#d31d30';
export const green = '#4ddaba';
export const blue = '#1f90db';
export const gray = '#9b9b9b';
export const lightgray = '#d0d0d0';
export const graphBkgd = '#fcfcfc';
export const chartBkgd = '#f0f2f5';
export const scenarioColors = ['#4ddaba', '#b6f5e7','#19b18e', '#e0fdf7', '#008769', '#acdacf']
export const mapLowColors = ['#deebf7', '#E0F5F0', '#FFEDE3', '#FFE6EA']
export const mapHighColors = ['#3885fa', '#148C81', '#E6500D', '#DE264D']

// ant design components are inline styled (and resist styling via css classes)
export const styles = {
    ContainerWhite: {
        background: '#fefefe',
        padding: '4rem 0',
        minHeight: '24rem'
    },
    ContainerGray: { padding: '4rem 0'
    },
    MapContainer: {
        paddingLeft: margin.yAxis + (2 * margin.left) + margin.right
    },
    SearchBar: {
        width: '100%',
        maxWidth: '50rem'
    },
    Menu: { 
        display: 'inline', 
        lineHeight: '2.8rem', 
        paddingRight: '10px'
    },
    iconGraph: { 
        paddingRight: '5px', 
        paddingTop: '5px' 
    },
    iconChart: { 
        paddingRight: '5px', 
        paddingTop: '5px', 
        marginRight: '8px' 
    },
    iconMap: { 
        paddingRight: '5px', 
        paddingTop: '5px', 
        marginRight: '3px' 
    },
    Selector: {
        width: '80%'
    },
    Switch: {
        marginTop: '16px',
        paddingLeft: '12px',
    },
    UploadSwitch: {
        paddingLeft: '12px'
    },
    Marks: {
        fontFamily: 'Cousine, monospace',
        fontSize: '12px',
        marginTop: '3px',
        color: 'rgba(0, 0, 0, 0.65)'
    }
};

export const STATS = [
    {'id': 1, 'key': 'incidH', 'name': 'Hospitalizations'},
    {'id': 2, 'key': 'incidD', 'name': 'Deaths'},
    {'id': 3, 'key': 'incidI', 'name': 'Infections'},
    {'id': 4, 'key': 'incidICU', 'name': 'ICU Cases'},
    {'id': 5, 'key': 'incidVent', 'name': 'Ventilators Used'}
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
