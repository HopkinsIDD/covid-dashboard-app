// config file used for testing local data files
// config and data files must exist in the store dir

export const USE_LOCAL_GEOID = false
export const LOCAL_GEOID = 'new_06085.json'

export const USE_LOCAL_ACTUALS = false
export const LOCAL_ACTUALS = 'new_06085_actuals.json'

// static files
export const CONFIGS = {
    'outcomes': {
        'use_local': false,
        'file_name': 'new_outcomes.json'
    },
    'statsForMap': {
        'use_local': false,
        'file_name': 'new_statsForMap.json'
    },
    'countyBoundaries': {
        'use_local': false,
        'file_name': 'new_countyBoundaries.json'
    }
}
