// id: explicit key to list items in onChange()
// key: use this to key into dataset
// name: display name for visualization

export const SCENARIOS = [
    {'id': 1, 'key': 'Fixed Lockdown', 'name': 'Fixed Lockdown'},
    {'id': 2, 'key': 'Fatiguing Lockdown', 'name': 'Fatiguing Lockdown'},
    // {'id': 3, 'key': 'Pulsed Lockdown', 'name': 'Pulsed Lockdown'},
    // {'id': 4, 'key': 'Fixed, Pulsed Lockdown', 'name': 'Fixed, Pulsed Lockdown'},
];

export const STATS = [
    {'id': 0, 'key': 'incidI', 'name': 'Infections'},
    {'id': 1, 'key': 'incidH', 'name': 'Hospitalizations'},
    {'id': 2, 'key': 'incidICU', 'name': 'ICU Cases'},
    {'id': 3, 'key': 'incidVent', 'name': 'Ventilator Usage'},
    {'id': 4, 'key': 'incidD', 'name': 'Deaths'},
];

export const LEVELS = [
    {'id': 1, 'key': 'high', 'name': '1% IFR, 10% hospitalization rate'}, 
    {'id': 2, 'key': 'medium', 'name': '0.5% IFR, 5% hospitalization rate'},
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