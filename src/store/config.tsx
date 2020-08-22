// config file used for testing local data files
// config and data files to test must exist in the store dir
// set file type to test to use_local = true and add update file_name value

export const USE_LOCAL_GEOID = false
export const LOCAL_GEOID = ''

export const USE_LOCAL_ACTUALS = false
export const LOCAL_ACTUALS = ''

// static files
export const CONFIGS = {
    'outcomes': {
        'use_local': true,
        'file_name': 'outcomes.json'
    },
    'statsForMap': {
        'use_local': false,
        'file_name': ''
    },
    'countyBoundaries': {
        'use_local': false,
        'file_name': ''
    }
}
