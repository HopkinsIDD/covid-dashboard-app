// id: explicit key to list items in onChange()
// key: use this to key into dataset
// name: display name for visualization

export const margin = { top: 20, right: 40, bottom: 30, left: 80 };
export const red = '#d31d30';
export const green = '#4ddaba';
export const blue = '#1f90db';
export const gray = '#9b9b9b';

export const SCENARIOS = [
    {'id': 1, 'key': 'USA_Uncontrolled', 'name': 'USA_Uncontrolled'},
    {'id': 2, 'key': 'USA_Lockdown1918', 'name': 'USA_Lockdown1918'},
    {'id': 3, 'key': 'USA_LockdownUK', 'name': 'USA_LockdownUK'},
];

export const STATS = [
    {'id': 1, 'key': 'incidI', 'name': 'Infections'},
    {'id': 2, 'key': 'incidH', 'name': 'Hospitalizations'},
    {'id': 3, 'key': 'incidICU', 'name': 'ICU Cases'},
    {'id': 4, 'key': 'incidVent', 'name': 'Ventilator Usage'},
    {'id': 5, 'key': 'incidD', 'name': 'Deaths'},
];

export const LEVELS = [
    {'id': 1, 'key': 'high', 'name': '1% IFR, 10% hospitalization rate'}, 
    {'id': 2, 'key': 'med', 'name': '0.5% IFR, 5% hospitalization rate'},
    {'id': 3, 'key': 'low', 'name': '0.25% IFR, 2.5% hospitalization rate'},
];

export const COUNTIES = [
    {'GEOID': '06067', 'NAME': 'Sacramento County', 'USPS': 'CA'},
    {'GEOID': '06081', 'NAME': 'San Mateo County', 'USPS': 'CA'},
    {'GEOID': '06085', 'NAME': 'Santa Clara County', 'USPS': 'CA'},
    {'GEOID': '06071', 'NAME': 'San Bernardino County', 'USPS': 'CA'},
    {'GEOID': '06073', 'NAME': 'San Diego County', 'USPS': 'CA'},
    {'GEOID': '10001', 'NAME': 'Lee County', 'USPS': 'AL'},
    {'GEOID': '10201', 'NAME': 'Tuskaloosa County', 'USPS': 'AL'},    
    {'GEOID': '10301', 'NAME': 'DeKalb County', 'USPS': 'AL'},
    {'GEOID': '10401', 'NAME': 'Jefferson County', 'USPS': 'AL'},
    {'GEOID': '10501', 'NAME': 'Clay County', 'USPS': 'AL'},
    {'GEOID': '10601', 'NAME': 'Coffee County', 'USPS': 'AL'},
];