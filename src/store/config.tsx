// config file used for testing local data files
// config and data files to test must exist in the store dir

// s3 bucket location of 3147 county geoid jsons
export const s3BucketUrl = process.env.NODE_ENV === 'development' ?
            'https://idd-dashboard-runs-staging.s3.amazonaws.com/json-files/'
            : 'json-files/'; // key prefix of relative bucket 

// set file type to test to use_local = true and add update file_name value
export const USE_LOCAL_GEOID = false
export const LOCAL_GEOID = ''

export const USE_LOCAL_ACTUALS = false
export const LOCAL_ACTUALS = ''

// static files
export const CONFIGS = {
    'outcomes': {
        'use_local': false,
        'file_name': ''
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
