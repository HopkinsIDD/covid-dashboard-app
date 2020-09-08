import { s3BucketUrl } from '../store/config';
import { USE_LOCAL_GEOID, LOCAL_GEOID, USE_LOCAL_ACTUALS, LOCAL_ACTUALS,
    CONFIGS } from '../store/config.tsx';

export async function fetchDataset(geoid) {
    // fetch dataset json for given geoid from s3 bucket e.g. 06085
    // check if file is local or use api
    
    if (USE_LOCAL_GEOID) {
        return require(`../store/${LOCAL_GEOID}`);
    } else {
        let response = await fetch(`${s3BucketUrl}${geoid}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error for ${geoid}. Status: ${response.status}`)
        } else {
            return await response.json();
        }
    }
}

export async function fetchActuals(geoid) {
    // fetch ground truth json for given geoid from s3 bucket e.g. 06085_actual
    
    if (USE_LOCAL_ACTUALS) {
        return require(`../store/${LOCAL_ACTUALS}`);
    } else {
        let response = await fetch(`${s3BucketUrl}${geoid}_actuals.json`);
        if (!response.ok) {
            throw new Error(`HTTP error for ${geoid} actuals. Status: ${response.status}`)
        } else {
            return await response.json();
        }
    }
}

export async function fetchConfig(type) {
    // fetch configs from s3 bucket like 'outcomes', 'statsForMap', 'countyBoundaries'
    
    if (CONFIGS[type].use_local) {
        return require(`../store/${CONFIGS[type].file_name}`);
    } else {
        let response = await fetch(`${s3BucketUrl}${type}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error for outcomes. Status: ${response.status}`)
        } else {
            return await response.json();
        }
    }
}
