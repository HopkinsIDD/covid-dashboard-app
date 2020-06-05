// id: explicit key to list items in onChange()
// key: use this to key into dataset
// name: display name for visualization

export const margin = { yAxis: 80, top: 10, right: 10, bottom: 30, left: 10, chartTop: 15 };

export const styles = {
    ContainerWhite: {
        background: '#fefefe',
        padding: '5rem 0',
        minHeight: '80vh'
    },
    ContainerGray: {
        padding: '5rem 0'
    },
    ContainerMap: {
        paddingLeft: margin.yAxis + (2 * margin.left) + margin.right
    },
    SearchBar: {
        width: '60%',
        maxWidth: '50rem'
    },
    Selector: {
        width: '80%'
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
    },
    SliderLabel: {
        marginTop: '12px'
    },
    MarksR0: {
        0: {
            style: {
                fontFamily: 'Cousine, monospace',
                fontSize: '12px',
                marginTop: '3px',
                color: 'rgba(0, 0, 0, 0.65)'
            },
            label: 0,
            }, 
        4: {
            style: {
                fontFamily: 'Cousine, monospace',
                fontSize: '12px',
                marginTop: '3px',
                color: 'rgba(0, 0, 0, 0.65)'
            },
            label: 4,
            }
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
