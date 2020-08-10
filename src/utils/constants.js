
// s3 bucket location of 3147 county geoid jsons
// export const s3BucketUrl = 'https://idd-dashboard-runs.s3.amazonaws.com/json-files/';
export const s3BucketUrl = 'https://covid-scenario-dashboard.s3.amazonaws.com/json-files/';

export const defaultGeoid = '06085';

// number of sim curves to be displayed in Graph
export const numDisplaySims = 30;  

// id: explicit key to list items in onChange()
// key: use this to key into dataset
// name: display name for visualization
export const LEVELS = [
    {'id': 1, 'key': 'high', 'name': '1% IFR'}, 
    {'id': 2, 'key': 'med', 'name': '0.5% IFR'},
    {'id': 3, 'key': 'low', 'name': '0.25% IFR'},
];

export const CONFINTERVALS = ['p10', 'p50', 'p90'];

export const monthDateFormat = '%b-%d';
export const margin = {
    yAxis: 80, 
    top: 10, 
    right: 10, 
    bottom: 40, 
    left: 20, 
    chartTop: 15 
};

export const dimMultipliers = {
    graphDesktopW: 0.6585, // multiplier for window.innerWidth to get graphW
    graphDesktopH: 0.53, // multiplier for window.innerHeight to get graphH
    graphMobileW: 0.9, // mobile view ratio multiplier for window.innerWidth to get graphW
    chartDesktopH: 1.15, // multiplies graphH to give chart a bit more height
    mapDesktopH: 0.35, // mobile view ratio multiplier for window.innerHeight to give each map quadrant less height than the full graph
    mapMobileW: 1.8, // mobile view ratio multiplier for window.innerWidth to get graphW for map
    brushOffset: 0.03, // multiplier of graphW so Brush is aligned with graph (accounts for width of y-axis label in flex container)
}

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
    gutter: {
        xs: 8, sm: 16, md: 24, lg: 32
    },
    SearchBar: {
        width: '100%',
        maxWidth: '50rem',
        padding: '0.8rem 0'
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
    Severity: {
        minWidth: '90%'
    },
    Menu: {
        paddingTop: '10px'
    },
    MenuMap: {
        paddingTop: '10px',
        paddingRight: '5px'
    },
    Radio: {
        paddingLeft: '8px', 
        paddingRight: '8px', 
        paddingTop: '5px', 
        lineHeight: '1rem', 
        height: '45px'
    },
    Switch: {
        paddingLeft: '12px',
        marginTop: '10px'
    },
    Marks: {
        fontFamily: 'Cousine, monospace',
        fontSize: '12px',
        marginTop: '3px',
        color: 'rgba(0, 0, 0, 0.65)'
    }
};
