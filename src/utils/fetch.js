import { s3BucketUrl } from '../utils/constants';

export async function fetchGeoJSON(geoid) {
    // fetch json for given county from s3 bucket
    
    let response = await fetch(`${s3BucketUrl}${geoid}.json`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    } else {
        return await response.json();
    }
}